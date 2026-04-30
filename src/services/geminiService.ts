import { GoogleGenAI } from "@google/genai";
import { TradeInputs, TradeResult } from "./goldTrade";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateBusinessPlan(inputs: TradeInputs, results: TradeResult, ventureText?: string) {
  if (!genAI) {
    // Static Fallback for when no API key is provided
    return `
# Tristar Commodities | Executive Summary (Preview Mode)

*Note: This is a system-generated summary. Connect a Gemini API Key for the full strategic narrative.*

## 1. Venture Overview
Strategic sourcing of gold from **${inputs.origin}** for liquidation in the **Dubai refined market (UAE)**.

## 2. Key Unit Economics (USD)
- **Trade Volume:** ${inputs.purchaseVolumeKg} KG
- **Refinery Rate:** LME Spot ($${inputs.lmePricePerKg.toLocaleString()}) minus 3%
- **Net Profit Target:** $${results.netProfit.toLocaleString()} per cycle
- **Return on Investment:** ${results.roi.toFixed(2)}x

## 3. Operational Directives
${ventureText || "Standard supply chain protocol active: Origin Assays > Export Logistics > UAE Customs Clearing > Refinery Liquidation."}

## 4. Financial Architecture
Total capital requirement estimated at **$${results.upfrontCostsTotal.toLocaleString()} USD**. This includes insurance, licensing, and logistics contingencies.

---
*For a professional 15-page institutional business plan with detailed risk analysis and market landscape, please provide a valid GEMINI_API_KEY in the environment settings.*
    `.trim();
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a highly detailed, professional Institutional Business Plan for a physical gold arbitrage venture.
    All financial values provided below and required in the report MUST be in US Dollars (USD).

    Venture Context:
    - Primary Sourcing: Physical gold bars from ${inputs.origin}.
    - Logistics: Secure transit from origin to Dubai, UAE.
    - Liquidation: Collaboration with Dubai Gold & precious metals refineries.
    - Transaction Terms: Sale to refineries at LME minus 3% discount.
    
    ${ventureText ? `SPECIFIC OPERATIONAL DIRECTIVES FROM USER:\n${ventureText}\n` : ''}

    Core Financial Data (Monthly Cycle in USD):
    - Trade Volume: ${inputs.purchaseVolumeKg} kg
    - Acquisition Price: $${inputs.purchasePricePerKg.toLocaleString()} USD / kg
    - Reference Market Price: $${inputs.lmePricePerKg.toLocaleString()} USD / kg
    - PROJECTED GROSS REVENUE: $${results.grossRevenue.toLocaleString()} USD
    - OPERATIONAL EXPENDITURE: $${(results.upfrontCostsTotal - (inputs.cifMode === 'PRE' ? inputs.advanceDepositPerKg * inputs.purchaseVolumeKg : 0)).toLocaleString()} USD
    - PROJECTED NET PROFIT: $${results.netProfit.toLocaleString()} USD
    - ROI: ${results.roi.toFixed(2)}x

    Required Section to Generate:
    1. Executive Summary & Value Proposition
    2. Market Analysis: The Dubai Gold Hub and West African Sourcing Landscape
    3. Operational Supply Chain: 
       - Sourcing protocols at origin.
       - Custodial Logistics and Secure Transport to UAE.
       - Dubai Customs (DMCC) clearing and compliance processes.
    4. Partnership Framework: Refinery collaboration and LME-indexed liquidation logic.
    5. Financial Architecture (USD): Breakdown of unit economics and margin protection.
    6. Risk Mitigation: Quality assays, trans-border legal compliance, and market volatility hedging.

    Tone: Sophisticated, institutional, and risk-aware.
    Format: Use clean Markdown with professional headers. Ensure the currency symbol ($) is used consistently.
  `;

  try {
    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
    });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating business plan. Please check your configuration.";
  }
}
