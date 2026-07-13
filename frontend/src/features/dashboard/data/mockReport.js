export const mockReport = {
  id: "rep_123456",
  date: "2026-07-14",
  patient: {
    name: "John Doe",
    age: 42,
    gender: "Male",
    bloodGroup: "O+",
  },
  healthScore: 82,
  summary: "Overall, your blood parameters are within normal limits. However, your lipid profile indicates mildly elevated LDL cholesterol and triglycerides, which slightly increases cardiovascular risk. Fasting glucose is at the upper limit of normal. We recommend a diet lower in saturated fats and refined sugars, combined with moderate aerobic exercise.",
  risks: [
    { name: "Cardiovascular", level: "Moderate", score: 65 },
    { name: "Diabetes", level: "Low", score: 30 },
    { name: "Anemia", level: "Low", score: 10 },
    { name: "Kidney Disease", level: "Low", score: 15 },
  ],
  parameters: [
    {
      category: "Complete Blood Count (CBC)",
      items: [
        { name: "Hemoglobin", value: 14.8, unit: "g/dL", range: "13.8 - 17.2", status: "normal" },
        { name: "WBC Count", value: 6.5, unit: "k/uL", range: "4.5 - 11.0", status: "normal" },
        { name: "Platelets", value: 250, unit: "k/uL", range: "150 - 450", status: "normal" },
      ]
    },
    {
      category: "Lipid Panel",
      items: [
        { name: "Total Cholesterol", value: 215, unit: "mg/dL", range: "< 200", status: "high" },
        { name: "LDL Cholesterol", value: 142, unit: "mg/dL", range: "< 100", status: "high" },
        { name: "HDL Cholesterol", value: 45, unit: "mg/dL", range: "> 40", status: "normal" },
        { name: "Triglycerides", value: 160, unit: "mg/dL", range: "< 150", status: "high" },
      ]
    },
    {
      category: "Metabolic Panel",
      items: [
        { name: "Fasting Glucose", value: 98, unit: "mg/dL", range: "70 - 99", status: "normal" },
        { name: "Creatinine", value: 0.9, unit: "mg/dL", range: "0.7 - 1.3", status: "normal" },
      ]
    }
  ],
  sources: [
    { title: "AHA Guidelines on Lipids", url: "#" },
    { title: "ADA Diabetes Standards 2025", url: "#" }
  ]
};
