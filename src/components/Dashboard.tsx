import { motion } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from "recharts";
import { TradeResult, TradeInputs } from "../services/goldTrade";
import { TrendingUp, DollarSign, PieChart as PieIcon, Activity } from "lucide-react";

interface Props {
  results: TradeResult;
  inputs: TradeInputs;
  isProcessing?: boolean;
}

export default function Dashboard({ results, inputs, isProcessing }: Props) {
  const COLORS = ['#00F0FF', '#FFD700', '#3b82f6', '#f59e0b', '#10b981'];

  const MetricCard = ({ title, value, icon: Icon, color, subValue, neonClass }: any) => (
    <div className={`glass-card p-4 transition-all hover:border-primary/40 ${neonClass ? 'border-primary/20 bg-primary/5' : ''}`}>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{title}</p>
      <div className="flex items-end justify-between mt-1">
        <h3 className={`text-2xl stat-value ${neonClass || color}`}>{value}</h3>
      </div>
      {subValue && <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{subValue}</p>}
    </div>
  );

  return (
    <div className={`space-y-6 transition-all duration-500 ${isProcessing ? 'blur-sm grayscale opacity-50' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Gross Revenue" 
          value={`$${results.grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          subValue="After Refinery"
          neonClass="neon-text-gold"
        />
        <MetricCard 
          title="Net Profit" 
          value={`$${results.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          subValue={`ROI: ${results.roi.toFixed(3)}x`}
          neonClass="neon-text-blue"
        />
        <MetricCard 
          title="Net Profit / KG" 
          value={`$${results.netProfitPerKg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          subValue="Efficiency"
          color="text-foreground"
        />
        <MetricCard 
          title="Total Upfront" 
          value={`$${results.upfrontCostsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          subValue="Security Capital"
          neonClass="neon-text-blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Detailed Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-gold/20"
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-secondary" />
            P&L Summary
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-xs text-muted-foreground capitalize">Gross Gold Value ({inputs.refineryYieldPercent}% Assay)</span>
              <span className="text-sm font-mono font-bold text-foreground">${results.grossGoldValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-xs text-red-400 capitalize">Less: Refinery {inputs.refineryTakePercent}% Premium (APM)</span>
              <span className="text-sm font-mono font-bold text-red-400">(${results.refineryPremium.toLocaleString()})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30 bg-muted/30 px-2 -mx-2 rounded font-bold">
              <span className="text-xs uppercase tracking-widest text-primary">Gross Revenue</span>
              <span className="text-sm font-mono text-primary">${results.grossRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-xs text-red-400 capitalize">Less: Mine Final Invoice</span>
              <span className="text-sm font-mono font-bold text-red-400">(${results.mineFinalInvoice.toLocaleString()})</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30 bg-secondary/5 px-2 -mx-2 rounded font-bold">
              <span className="text-xs uppercase tracking-widest text-secondary">Gross Profit After-Mine</span>
              <span className="text-sm font-mono text-secondary">${results.grossProfitAfterMine.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-xs text-red-400 capitalize">Less: Upfront Costs</span>
              <span className="text-sm font-mono font-bold text-red-400">(${results.upfrontCostsTotal.toLocaleString()})</span>
            </div>
            <div className="mt-8 pt-4 border-t-2 border-primary/20 flex justify-between items-center">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Net Profit (Per Cycle)</span>
              <span className="text-xl font-mono font-black neon-text-blue">${results.netProfit.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Upfront Costs Detailed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Up-Front Costs (USD)
          </h3>
          
          <div className="space-y-4">
            {results.upfrontBreakdown.map((item, idx) => (
              item.value > 0 && (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-mono font-bold text-foreground">${item.value.toLocaleString()}</span>
                </div>
              )
            ))}
            <div className="mt-8 pt-4 border-t-2 border-border flex justify-between items-center">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Total Upfront Costs</span>
              <span className="text-xl font-mono font-black neon-text-blue">${results.upfrontCostsTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational Context</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded">
                <p className="text-[9px] text-muted-foreground uppercase mb-1">Cycle Time</p>
                <p className="text-xs font-bold text-primary">{results.cycleTime}</p>
              </div>
              <div className="bg-muted/30 p-3 rounded">
                <p className="text-[9px] text-muted-foreground uppercase mb-1">ROI Multiplier</p>
                <p className="text-xs font-bold text-secondary">{results.roi.toFixed(4)}x</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Track Bar */}
      <section className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 lg:gap-12 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.5)]"></div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-tighter font-bold">Origination</p>
              <p className="text-xs font-semibold">{inputs.origin} Source</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-800 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.5)]"></div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-tighter font-bold">Transit</p>
              <p className="text-xs font-semibold">{inputs.cifMode === 'PRE' ? 'Buyer Arranged' : 'Mine CIF'}</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-800 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.5)]"></div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-tighter font-bold">Clearance</p>
              <p className="text-xs font-semibold">Dubai Customs (DMCC)</p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-800 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,215,0,0.5)]"></div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 tracking-tighter font-bold">Refinery</p>
              <p className="text-xs font-semibold">LME Registered (UAE)</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
          Active Tracking
        </div>
      </section>
    </div>
  );
}
