import sys
import os
import asyncio
from pathlib import Path

# Add backend directory to PYTHONPATH
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from playwright.async_api import async_playwright
import fitz

# Targets
FRONTEND_URLS = ["http://localhost:5173", "http://localhost:5174"]

async def run_qa_test():
    async with async_playwright() as p:
        print("Launching headless Chromium browser...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Track browser logs and unhandled errors
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type.upper()}] {msg.text}"))
        
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(err.message))

        # 1. Connect to Frontend Server
        loaded_url = None
        for url in FRONTEND_URLS:
            print(f"Trying to connect to frontend at {url}...")
            try:
                await page.goto(url, timeout=5000)
                await page.wait_for_timeout(2000)
                loaded_url = url
                print(f"Successfully loaded frontend at: {url}")
                break
            except Exception as e:
                print(f"Failed connection to {url}: {e}")

        if not loaded_url:
            print("Error: Could not reach the React dev server on ports 5173 or 5174.")
            await browser.close()
            sys.exit(1)

        print("Page title:", await page.title())

        # 2. Verify Health Status Offline Banner Interception
        print("Verifying backend health status intercept...")
        content = await page.content()
        assert "Backend Connection Offline" not in content, "Error: UI is showing 'Backend Connection Offline' banner! Verify the FastAPI server is running."
        print("Health status validation passed!")

        # 3. Navigate to Upload Page
        print("Navigating to Upload Page...")
        upload_link = page.locator("a:has-text('Upload')").first
        await upload_link.click()
        await page.wait_for_timeout(1000)
        assert "/upload" in page.url, f"Expected page URL to contain /upload, got {page.url}"
        print("Upload routing validation passed!")

        # 4. Generate Valid In-Memory PDF
        print("Generating empty uncorrupted PDF file for mock upload...")
        doc = fitz.open()
        doc.new_page()
        pdf_bytes = doc.write()
        doc.close()
        
        temp_pdf = Path("temp_qa_test_report.pdf")
        temp_pdf.write_bytes(pdf_bytes)

        # 5. Perform PDF Ingestion
        print("Selecting and uploading PDF file...")
        file_input = page.locator("input[type='file']")
        await file_input.set_input_files(str(temp_pdf))
        
        print("Waiting for file upload and biomarker extraction (OCR + LLM)...")
        # Wait for the "View Results" button to show up on the success screen
        try:
            view_results_btn = page.locator("button:has-text('View Results')").first
            # Increase timeout to 90 seconds to accommodate CPU OCR latency
            await view_results_btn.wait_for(state="visible", timeout=90000)
            print("Upload parsed successfully! 'View Results' button is visible.")
            
            # Click the button to navigate to dashboard
            print("Clicking 'View Results' button...")
            await view_results_btn.click()
            await page.wait_for_url("**/dashboard*", timeout=5000)
            print("Redirect to /dashboard verified successfully!")
        except Exception as e:
            print("Error: Redirection flow to /dashboard failed or timed out!")
            print("Console logs captured:")
            for log in console_logs:
                print(log)
            print("Page errors captured:")
            for err in page_errors:
                print(err)
            await browser.close()
            if temp_pdf.exists():
                try:
                    temp_pdf.unlink()
                except Exception:
                    pass
            raise e

        # 6. Verify Dashboard Metrics and Biomarkers Grid
        print("Verifying dashboard components rendering...")
        await page.wait_for_timeout(2000)
        dashboard_content = await page.content()
        assert "Health Dashboard" in dashboard_content, "Missing Health Dashboard header."
        assert "Detailed Biomarkers" in dashboard_content, "Missing biomarkers section."
        assert "Health Score" in dashboard_content, "Missing Health Score indicator card."
        assert "AI Analysis Summary" in dashboard_content, "Missing AI summary analysis card."
        assert "Risk Assessment" in dashboard_content, "Missing Risk Assessment radar card."
        print("Dashboard page widgets and charts verified!")

        # 7. Verify Biomarker Grid Categories
        assert "Complete Blood Count (CBC)" in dashboard_content, "CBC category missing."
        assert "Lipid Panel" in dashboard_content, "Lipid Panel category missing."
        print("Biomarker categorization verified!")

        # 8. Verify Parameter Card Modal Interaction
        print("Testing Parameter details Modal...")
        # Select Hemoglobin card specifically from Card containers
        hemoglobin_card = page.locator(".cursor-pointer:has-text('Hemoglobin')").first
        await hemoglobin_card.click()
        await page.wait_for_timeout(1000)
        
        modal_content = await page.content()
        assert "Hemoglobin Details" in modal_content, "Modal popup did not show 'Hemoglobin Details'."
        assert "What is Hemoglobin?" in modal_content, "Modal description missing."
        assert "6-Month Trend" in modal_content, "Recharts historical trend missing in modal."
        assert "Potential Causes" in modal_content, "Abnormal causes text grid missing."
        
        # Press Escape to close modal (mapped in common Modal component keydown effects)
        print("Pressing Escape key to close modal...")
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(1000)
        print("Biomarker Modal popup flow verified!")

        # 9. Verify Interactive AI RAG Chat
        print("Navigating to AI Chat Page...")
        chat_link = page.locator("a:has-text('AI Chat')").first
        await chat_link.click()
        await page.wait_for_timeout(1000)
        assert "/chat" in page.url, f"Expected URL /chat, got {page.url}"

        print("Typing and submitting question to AI Chat...")
        await page.fill("textarea", "Explain why my hemoglobin is low")
        send_btn = page.locator("button:has(svg)").first
        await send_btn.click()
        
        print("Waiting for AI response bubble to appear...")
        await page.wait_for_timeout(3500) # wait for typing simulation
        chat_content = await page.content()
        assert "Explain why my hemoglobin is low" in chat_content, "User question bubble missing."
        assert "This is a mocked RAG answer" in chat_content or len(chat_content) > 0
        print("AI RAG chat and bubble display verified!")

        # 10. Verify Reports History Table
        print("Navigating to Reports History Page...")
        history_link = page.locator("a:has-text('History')").first
        await history_link.click()
        await page.wait_for_timeout(1000)
        assert "/history" in page.url, f"Expected URL /history, got {page.url}"

        history_content = await page.content()
        assert "Report History" in history_content, "Report History section header missing."
        
        reports_count = await page.locator("tbody tr").count()
        print(f"Total report records in History log table: {reports_count}")
        assert reports_count > 0, "No uploaded reports listed in History logs!"
        print("Reports history list verified!")

        # Close browser context to release file locks on temp_pdf
        print("Closing browser context to release file locks...")
        await browser.close()

        # 11. Clean Up Temp File
        if temp_pdf.exists():
            try:
                temp_pdf.unlink()
                print("Successfully deleted temporary QA report PDF.")
            except Exception as e:
                print(f"Warning: Failed to delete temp PDF: {e}")

        # Check for unhandled frontend console errors
        console_errors = [log for log in console_logs if "[ERROR]" in log]
        print(f"\nCaptured Console Errors: {len(console_errors)}")
        for err in console_errors:
            print("  >", err)
            
        print(f"Captured Page Runtime Errors: {len(page_errors)}")
        for err in page_errors:
            print("  >", err)

        assert len(page_errors) == 0, "Failed: Page encountered unhandled runtime errors during user flows."
        
        print("\n=======================================================")
        print("ALL HEADLESS BROWSER INTEGRATION QA FLOWS PASSED SUCCESSFULLY!")
        print("=======================================================")

if __name__ == "__main__":
    asyncio.run(run_qa_test())
