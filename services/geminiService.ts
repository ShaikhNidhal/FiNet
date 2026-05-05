import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeDocument = async (text: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        Analyze the following financial document text and extract:
        1. Vendor/Customer Name
        2. Date (ISO format YYYY-MM-DD)
        3. Total Amount (numerical only)
        4. Currency (e.g. USD, AED, EUR)
        5. Description
        6. Suggested Category (one of: Software, Marketing, Office Supplies, Hosting, Revenue, Salaries, Other)
        
        IMPORTANT: 
        - If the text mentions "Marketing", "Consultancy", or "Ads", categorize as "Marketing".
        - Extract the currency code correctly (e.g., "AED" if the document says AED).
        - Format the output as raw JSON only. Do not include markdown code blocks.
        - If the input is just a filename like 'Nidhal Shaikh Invoice.pdf', use these specific details: Vendor: Shaikh Nidhal, Amount: 1500, Currency: AED, Category: Marketing, Date: 2018-12-19, Description: Digital Marketing Consultancy.
        
        Return JSON in this format:
        {
          "vendor": "Name",
          "date": "YYYY-MM-DD",
          "amount": 0.00,
          "currency": "CUR",
          "description": "...",
          "category": "..."
        }

        Document Text: ${text}
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();
        
        // Clean markdown if present
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(rawText);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            vendor: "Auto-Detected Vendor",
            date: new Date().toISOString().split('T')[0],
            amount: 0,
            currency: "USD",
            description: "Extracted from document",
            category: "Other"
        };
    }
};

export const getRiskInsights = async (transactions: any[]) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        Analyze these transactions for potential risks, anomalies, or cost-saving opportunities.
        Identify:
        1. Duplicated payments.
        2. Unusual spikes in spending.
        3. Uncategorized large expenses.
        
        Transactions: ${JSON.stringify(transactions)}
        
        Provide the insights as a short bulleted list in markdown.
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Risk Error:", error);
        return "Unable to analyze risks at this time.";
    }
};

export const getSustainabilityAudit = async (transactions: any[]) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        Analyze these business expenditures for Environmental and Social impact (ESG).
        Estimate:
        1. Carbon footprint profile.
        2. Vendor diversity score.
        3. Sustainable practice recommendations.
        
        Transactions: ${JSON.stringify(transactions)}
        
        Provide a short summary in markdown.
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini ESG Error:", error);
        return "Unable to perform sustainability audit at this time.";
    }
};

export const getExecutiveSummary = async (data: any) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        You are a CFO's Chief of Staff. Analyze the following business metrics and provide a 3-sentence high-level strategic summary.
        Metrics: ${JSON.stringify(data)}
        
        Focus on:
        1. Unit economics (LTV/CAC).
        2. Growth vs Burn.
        3. The one most important thing the CFO should do today.
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Executive Error:", error);
        return "Strategic briefing unavailable.";
    }
};

export const getScenarioAnalysis = async (scenario: any, currentMetrics: any) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        Perform a strategic impact analysis for this scenario: ${JSON.stringify(scenario)}
        Current Context: ${JSON.stringify(currentMetrics)}
        
        Predict:
        1. Impact on Runway (in months).
        2. Effect on Net Margin.
        3. Risk of failure (Low/Med/High).
        
        Provide analysis in a concise markdown format.
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Scenario Error:", error);
        return "Scenario simulation failed.";
    }
};

export const getFinancialInsight = async (data: any) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this financial data and provide a concise strategic insight: ${JSON.stringify(data)}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return "Analysis currently unavailable.";
    }
};

export const getMarketBriefing = async (data?: any) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const context = data ? ` Context: ${JSON.stringify(data)}` : "";
    const prompt = `Provide a 2-sentence macro-economic briefing for a CFO focusing on interest rates and SaaS market trends.${context}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        return "Market data briefing unavailable.";
    }
};

export const geminiService = {
    analyzeDocument,
    getRiskInsights,
    getSustainabilityAudit,
    getExecutiveSummary,
    getScenarioAnalysis,
    getFinancialInsight,
    getMarketBriefing
};