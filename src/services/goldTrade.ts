export type CIFMode = 'PRE' | 'AFTER';

export interface TradeInputs {
  purchaseVolumeKg: number;
  purchasePricePerKg: number;
  lmePricePerKg: number;
  cifMode: CIFMode;
  refineryYieldPercent: number; // e.g. 96.5%
  refineryTakePercent: number; // e.g. 3% (APM)
  
  // Upfront Costs
  advanceDepositPerKg: number; // PRE only
  insurancePerKg: number; // PRE only
  intermediaryCommissionsPerKg: number;
  opexFixed: number;
  contingencyPercent: number;

  origin: 'Guinea' | 'Uganda' | 'Mixed';
}

export interface TradeResult {
  grossGoldValue: number;
  grossRevenue: number;
  refineryPremium: number;
  apmPremium: number;
  grossProfitBeforeMine: number;
  mineFinalInvoice: number;
  grossProfitAfterMine: number;
  upfrontCostsTotal: number;
  netProfit: number;
  netProfitPerKg: number;
  roi: number;
  cycleTime: string;
  breakdown: Array<{ name: string; value: number }>;
  upfrontBreakdown: Array<{ name: string; value: number }>;
}

export const calculateTrade = (inputs: TradeInputs): TradeResult => {
  const {
    purchaseVolumeKg,
    purchasePricePerKg,
    lmePricePerKg,
    cifMode,
    refineryYieldPercent,
    refineryTakePercent,
    advanceDepositPerKg,
    insurancePerKg,
    intermediaryCommissionsPerKg,
    opexFixed,
    contingencyPercent
  } = inputs;

  // 1. Gross Gold Value calculation (Before any refinery deductions)
  // Base: LME * Assay * Volume
  const grossGoldValue = lmePricePerKg * (refineryYieldPercent / 100) * purchaseVolumeKg;
  
  // 2. Refinery Premium Deduction (APM 3%)
  const refineryPremium = grossGoldValue * (refineryTakePercent / 100);
  
  // 3. Gross Revenue (After Refinery Calculation)
  const grossRevenue = grossGoldValue - refineryPremium;
  
  // Alias for backward compatibility if needed, but we'll use grossRevenue as the primary net
  const apmPremium = refineryPremium; 

  // 4. Upfront Costs
  const deposit = cifMode === 'PRE' ? advanceDepositPerKg * purchaseVolumeKg : 0;
  const insurance = cifMode === 'PRE' ? insurancePerKg * purchaseVolumeKg : 0;
  const commissions = intermediaryCommissionsPerKg * purchaseVolumeKg;
  const opex = opexFixed;
  
  // Contingency - base it on (Deposit + Insurance + Commissions + OPEX)
  const baseForContingency = deposit + insurance + commissions + opex;
  const contingency = baseForContingency * (contingencyPercent / 100);
  
  const upfrontCostsTotal = deposit + insurance + commissions + opex + contingency;

  // 4. Mine Payment
  const mineTotalCost = purchasePricePerKg * purchaseVolumeKg;
  const mineFinalInvoice = mineTotalCost - deposit;

  // 6. Profitability
  // Gross Profit = Gross Revenue (already net of refinery) - Mine Final Invoice
  // Wait, let's re-align with user request for clarity:
  // Revenue (Post-Refinery) - Total Mine Cost - Other Upfronts
  
  const otherUpfronts = insurance + commissions + opex + contingency;
  
  const grossProfitBeforeMine = grossRevenue; // Revenue after refinery
  const finalGross = grossProfitBeforeMine - mineFinalInvoice;
  const calculatedNetProfit = grossRevenue - mineTotalCost - otherUpfronts;

  const netProfitPerKg = calculatedNetProfit / purchaseVolumeKg;
  const roi = calculatedNetProfit / upfrontCostsTotal;

  return {
    grossGoldValue,
    grossRevenue,
    refineryPremium,
    apmPremium,
    grossProfitBeforeMine,
    mineFinalInvoice,
    grossProfitAfterMine: finalGross,
    upfrontCostsTotal,
    netProfit: calculatedNetProfit,
    netProfitPerKg,
    roi,
    cycleTime: '2-3 Weeks',
    breakdown: [
      { name: 'Gross Revenue', value: grossRevenue },
      { name: 'Mine Payment', value: -mineTotalCost },
      { name: 'OpEx/CIF', value: -otherUpfronts },
    ],
    upfrontBreakdown: [
      { name: 'Deposit', value: deposit },
      { name: 'Insurance', value: insurance },
      { name: 'Commissions', value: commissions },
      { name: 'OPEX', value: opex },
      { name: 'Contingency', value: contingency },
    ]
  };
};
