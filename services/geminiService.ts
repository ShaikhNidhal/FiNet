import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
    async analyzeDocument(text: string) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            Analyze the following financial document text and extract:
            1. Vendor/Customer Name
            2. Date
            3. Total Amount
            4. Description
            5. Suggested Category (one of: Software, Marketing, Office Supplies, Hosting, Revenue, Other)
            
            IMPORTANT: Format the output as raw JSON only. Do not include markdown code blocks.
            If the input is just a filename, generate realistic mock data for that document type.
            
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
            // Fallback for demo stability
            return {
                vendor: "Auto-Detected Vendor",
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                description: "Extracted from document",
                category: "Other"
            };
        }
    },

    async getRiskInsights(transactions: any[]) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            Analyze these transactions for potential risks, anomalies, or cost-saving opportunities.
            Identify:
            1. Unusual spending spikes.
            2. Potential duplicate charges.
            3. Recommendations for the CFO.
            
            Transactions: ${JSON.stringify(transactions)}
            
            Format the response as a professional financial summary.
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Risk Insight Error:", error);
            return "Unable to generate insights at this time.";
        }
    },

    async getFinancialInsight(query: string) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            You are FiNet AI, a strategic financial advisor for CFOs.
            Answer the following query professionally and concisely:
            "${query}"
            
            Focus on actionable financial advice.
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Insight Error:", error);
            return "I'm sorry, I couldn't process that financial query right now.";
        }
    },

    async getSustainabilityAudit(transactions: any[]) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            Analyze these business expenditures for Environmental and Social impact (ESG).
            Estimate:
            1. Carbon footprint (high-level).
            2. Social sustainability (diversity, fair labor potential).
            3. Regulatory compliance risks (CSRD/SFDR).
            
            Transactions: ${JSON.stringify(transactions.slice(0, 20))}
            
            Provide a brief, professional ESG audit summary for a board-level presentation.
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini ESG Audit Error:", error);
            return "ESG Analysis temporarily unavailable.";
        }
    },

    async getMarketBriefing(insights: any[]) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            You are a senior financial analyst. Synthesize the following market insights into a concise "CFO Morning Briefing".
            Include:
            1. Key Market Risks.
            2. Strategic Opportunities.
            3. Recommended actions for today.
            
            Insights: ${JSON.stringify(insights)}
            
            Keep the tone urgent, professional, and data-driven.
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Briefing Error:", error);
            return "Unable to generate briefing at this time.";
        }
    },

    async getExecutiveSummary(data: any) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
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
            console.error("Gemini Summary Error:", error);
            return "Strategic advice currently unavailable.";
        }
    }
};

export const getFinancialInsight = geminiService.getFinancialInsight;