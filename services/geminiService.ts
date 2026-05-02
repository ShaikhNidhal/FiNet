import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Assume process.env.API_KEY is available in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getFinancialInsight = async (query: string): Promise<string> => {
  if (!API_KEY) {
    return "The AI feature is currently unavailable. Please configure the API key.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are FiNet, an AI financial assistant integrated into a business finance dashboard. The user has access to their dashboard which includes data on cash balance, net income, expenses, transactions, inventory, and cash flow. Based on the user's question, provide a concise and helpful financial insight. Do not invent precise numbers unless the user's query implies them. Ground your answer in general financial principles as they would apply to their dashboard data. User question: "${query}"`,
        config: {
            temperature: 0.5,
            topK: 32,
            topP: 1,
            // Disable thinking for faster responses for this specific interactive feature.
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};