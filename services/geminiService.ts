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
            
            Format the output as JSON.
            Document Text: ${text}
        `;
        
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("Gemini Analysis Error:", error);
            return null;
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
    }
};

export const getFinancialInsight = geminiService.getFinancialInsight;