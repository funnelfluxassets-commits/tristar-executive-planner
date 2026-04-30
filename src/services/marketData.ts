
export interface MarketPrice {
  price: number;
  currency: string;
  unit: string;
  updatedAt: string;
}

export const fetchLiveGoldPrice = async (): Promise<number | null> => {
  try {
    // Primary Source: CoinGecko (PAX Gold) - Very reliable free CORS API
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
    if (response.ok) {
      const data = await response.json();
      if (data['pax-gold']?.usd) {
        return data['pax-gold'].usd * 32.1507;
      }
    }
  } catch (e) {
    console.warn('CoinGecko fetch failed, trying fallback...');
  }

  try {
    // Fallback Source: Gold-API (Public endpoint)
    const response = await fetch('https://api.gold-api.com/api/XAU/USD');
    if (response.ok) {
      const data = await response.json();
      if (data.price) {
        return data.price * 32.1507;
      }
    }
  } catch (e) {
    console.error('All gold price sources failed');
  }

  return null;
};
