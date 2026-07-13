export const mockParameterDetails = {
  "Hemoglobin": {
    description: "Hemoglobin is a protein in your red blood cells that carries oxygen to your body's organs and tissues and transports carbon dioxide from your organs and tissues back to your lungs.",
    causesOfHigh: ["Dehydration", "Smoking", "Living at high altitudes", "Lung disease"],
    causesOfLow: ["Iron deficiency anemia", "Vitamin B12 deficiency", "Kidney disease", "Blood loss"],
    dietaryAdvice: "For low hemoglobin, increase intake of iron-rich foods like spinach, red meat, and lentils. Pair with Vitamin C for better absorption.",
    historicalData: [
      { date: 'Jan', value: 13.5 },
      { date: 'Mar', value: 14.0 },
      { date: 'May', value: 14.5 },
      { date: 'Jul', value: 14.8 },
    ]
  },
  "LDL Cholesterol": {
    description: "Low-density lipoprotein (LDL) is often called 'bad' cholesterol because it collects in the walls of your blood vessels, raising your chances of health problems like a heart attack or stroke.",
    causesOfHigh: ["Diet high in saturated fats", "Lack of physical activity", "Obesity", "Genetics (Familial hypercholesterolemia)"],
    causesOfLow: ["Rare genetic conditions", "Severe malnutrition", "Hyperthyroidism"],
    dietaryAdvice: "Reduce saturated fats (found in red meat and full-fat dairy) and eliminate trans fats. Eat foods rich in omega-3 fatty acids and increase soluble fiber (oats, beans).",
    historicalData: [
      { date: 'Jan', value: 160 },
      { date: 'Mar', value: 155 },
      { date: 'May', value: 148 },
      { date: 'Jul', value: 142 },
    ]
  },
  "Fasting Glucose": {
    description: "Fasting blood sugar measures the amount of glucose (sugar) in your blood after you haven't eaten for at least 8 hours. It's a key indicator for diabetes and insulin resistance.",
    causesOfHigh: ["Diabetes or prediabetes", "Stress", "Certain medications (like steroids)", "Pancreatic disorders"],
    causesOfLow: ["Too much insulin/diabetes medication", "Skipping meals", "Liver disease"],
    dietaryAdvice: "Focus on complex carbohydrates with low glycemic index. Include protein and healthy fats with every meal to stabilize blood sugar spikes.",
    historicalData: [
      { date: 'Jan', value: 92 },
      { date: 'Mar', value: 95 },
      { date: 'May', value: 94 },
      { date: 'Jul', value: 98 },
    ]
  }
};

// Fallback for parameters not explicitly defined
export const fallbackParameterDetails = {
  description: "This biomarker is an essential component measured in standard laboratory tests to assess your metabolic or hematological health.",
  causesOfHigh: ["Consult your healthcare provider for specific causes."],
  causesOfLow: ["Consult your healthcare provider for specific causes."],
  dietaryAdvice: "Maintain a balanced diet and regular exercise routine. Discuss specific dietary interventions with your doctor.",
  historicalData: [
    { date: 'Jan', value: 50 },
    { date: 'Mar', value: 52 },
    { date: 'May', value: 49 },
    { date: 'Jul', value: 51 },
  ]
};
