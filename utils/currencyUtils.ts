
// Mock exchange rates for demonstration purposes
const EXCHANGE_RATES: Record<string, number> = {
    "USD_AED": 3.67,
    "AED_USD": 0.272,
    "USD_EUR": 0.92,
    "EUR_USD": 1.09,
    "USD_GBP": 0.79,
    "GBP_USD": 1.27,
    "AED_EUR": 0.25,
    "EUR_AED": 4.00,
};

/**
 * Converts an amount between currencies.
 * @param amount The numerical amount to convert
 * @param from The source currency code (e.g., 'AED')
 * @param to The target currency code (e.g., 'USD')
 * @returns The converted amount
 */
export const convertCurrency = (amount: number, from: string, to: string): number => {
    if (from === to) return amount;
    
    const key = `${from}_${to}`;
    if (EXCHANGE_RATES[key]) {
        return amount * EXCHANGE_RATES[key];
    }
    
    // Fallback if rate not found: convert through USD
    if (to === 'USD') {
        const fallbackKey = `${from}_USD`;
        return EXCHANGE_RATES[fallbackKey] ? amount * EXCHANGE_RATES[fallbackKey] : amount;
    }
    
    if (from === 'USD') {
        const fallbackKey = `USD_${to}`;
        return EXCHANGE_RATES[fallbackKey] ? amount * EXCHANGE_RATES[fallbackKey] : amount;
    }

    return amount; // No conversion found
};

export const SUPPORTED_CURRENCIES = ["USD", "AED", "EUR", "GBP", "JPY", "SAR"];
