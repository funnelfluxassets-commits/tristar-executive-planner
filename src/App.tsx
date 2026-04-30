import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Diamond, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Globe, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  FileText,
  GanttChartSquare,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import InputPanel from "./components/InputPanel";
import Dashboard from "./components/Dashboard";
import PlanNarrative from "./components/PlanNarrative";
import { TradeInputs, calculateTrade } from "./services/goldTrade";
import { fetchLiveGoldPrice } from "./services/marketData";

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plan'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [ventureText, setVentureText] = useState<string>("");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);
  const [inputs, setInputs] = useState<TradeInputs>({
    purchaseVolumeKg: 40,
    purchasePricePerKg: 104000,
    lmePricePerKg: 152000,
    cifMode: 'PRE',
    refineryYieldPercent: 96.5,
    refineryTakePercent: 3,
    advanceDepositPerKg: 2000,
    insurancePerKg: 1800,
    intermediaryCommissionsPerKg: 2000,
    opexFixed: 25000,
    contingencyPercent: 1.5,
    origin: 'Guinea',
  });

  useEffect(() => {
    const getPrice = async () => {
      const price = await fetchLiveGoldPrice();
      if (price) setLivePrice(price);
    };
    
    getPrice();
    const interval = setInterval(getPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const results = useMemo(() => calculateTrade(inputs), [inputs]);

  const handleRunSimulation = () => {
    setIsProcessing(true);
    setActiveTab('dashboard');
    setTimeout(() => {
      setIsProcessing(false);
    }, 1200);
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        activeTab === id 
          ? 'bg-primary/10 text-primary border-r-4 border-primary' 
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col lg:flex-row font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Mobile Header (Logo) */}
      <header className="lg:hidden p-4 border-b border-border flex justify-between items-center bg-card z-50">
        <div className="flex items-center gap-2">
          <img src="/media/Star.png" alt="Star Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
          <div className="flex flex-col w-fit">
            <span className="text-lg font-black tracking-tighter uppercase leading-none neon-text-gold">TRISTAR</span>
            <div className="flex justify-between w-full text-[8px] text-muted-foreground font-bold mt-0.5">
              {"COMMODITIES".split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-[#FFD700]" /> : <Moon className="w-5 h-5 text-blue-500" />}
        </button>
      </header>

      {/* Sidebar - Navigation */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="flex items-center justify-center">
            <img src="/media/Star.png" alt="Star Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col w-fit">
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none neon-text-gold">TRISTAR</h1>
            <div className="flex justify-between w-full text-[8px] text-muted-foreground font-bold mt-0.5">
              {"COMMODITIES".split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Operations</p>
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="P&L Forecast" />
          <SidebarItem id="plan" icon={GanttChartSquare} label="Plan Narrative" />
          
          <div className="pt-8">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Support</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all opacity-50 cursor-not-allowed text-left">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#8E9299]">Market Feed</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-all opacity-50 cursor-not-allowed text-left">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#8E9299]">Legal Docs</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-primary/40">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Market Status</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className={`block text-[8px] font-bold uppercase tracking-widest leading-none mb-1 ${livePrice ? 'text-primary/70' : 'text-red-400'}`}>
                  {livePrice ? 'LBMA AM FIX / SPOT' : 'SYSTEM OFFLINE'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${livePrice ? 'bg-primary animate-pulse' : 'bg-red-500'}`}></span>
                  <span className="text-xs font-mono text-primary uppercase">GOLD SPOT LIVE</span>
                </div>
              </div>
              <div className="text-right group relative">
                <span className="block text-sm font-mono font-black text-primary neon-text-blue">
                  {livePrice ? `$${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : (
                    <button 
                      onClick={() => fetchLiveGoldPrice().then(p => p && setLivePrice(p))}
                      className="text-[10px] text-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  )}
                </span>
                <span className="text-[8px] text-gray-500 font-mono">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Executive Report Header */}
        <header className="flex p-4 lg:p-8 border-b border-border items-center lg:items-end justify-between bg-card z-40 sticky top-0">
          <div className="space-y-1">
            <p className="text-primary text-[10px] lg:text-xs font-mono uppercase tracking-[0.3em]">Executive Report</p>
            <h2 className="text-base md:text-xl lg:text-3xl font-light italic text-foreground leading-tight whitespace-nowrap">Gold Supply Chain: West Africa to UAE</h2>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted border border-border text-foreground transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD700]" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-8">
          <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 h-full items-center xl:items-start">
            
            {/* Left Column: Inputs */}
            <div className="w-full xl:w-80 flex-shrink-0">
               <InputPanel 
                 inputs={inputs} 
                 setInputs={setInputs} 
                 ventureText={ventureText}
                 setVentureText={setVentureText}
                 onRun={handleRunSimulation}
                 isProcessing={isProcessing}
                 livePrice={livePrice}
               />
            </div>

            {/* Right Column: Results/Dashboard */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' ? (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard results={results} inputs={inputs} isProcessing={isProcessing} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PlanNarrative 
                      inputs={inputs} 
                      results={results} 
                      ventureText={ventureText}
                      theme={theme}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Decorative Blur Backgrounds */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-secondary/5 blur-[120px] pointer-events-none rounded-full" />
    </div>
  );
}
