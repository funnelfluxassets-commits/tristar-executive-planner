import { motion } from "motion/react";
import { Plus, Minus, Info, FileText, Type, Upload, RefreshCw, TrendingUp } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { TradeInputs } from "../services/goldTrade";

interface Props {
  inputs: TradeInputs;
  setInputs: React.Dispatch<React.SetStateAction<TradeInputs>>;
  ventureText: string;
  setVentureText: (text: string) => void;
  onRun: () => void;
  isProcessing: boolean;
  livePrice: number | null;
}

interface InputFieldProps {
  label: string;
  field: keyof TradeInputs;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  inputs: TradeInputs;
  setInputs: React.Dispatch<React.SetStateAction<TradeInputs>>;
}

const InputField = React.memo(({ label, field, min, max, step, suffix = "", inputs, setInputs }: InputFieldProps) => {
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const updateValue = useCallback((delta: number) => {
    setInputs((prev) => {
      const currentValue = prev[field] as number;
      const newValue = Number(Math.min(max, Math.max(min, currentValue + delta)).toFixed(2));
      return { ...prev, [field]: newValue };
    });
  }, [field, max, min, setInputs]);

  const startRepeating = (delta: number) => {
    updateValue(delta);
    // Start repeating after a short delay
    timeoutRef.current = window.setTimeout(() => {
      // 80ms interval for a smooth, steady progression
      intervalRef.current = window.setInterval(() => updateValue(delta), 80);
    }, 300);
  };

  const stopRepeating = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopRepeating();
  }, []);

  return (
    <div className="bg-card p-3 rounded border border-border mb-3">
      <p className="text-[10px] text-primary mb-1 uppercase tracking-[0.2em] font-black neon-text-blue">{label}</p>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1">
          <button 
            onMouseDown={() => startRepeating(-step)}
            onMouseUp={stopRepeating}
            onMouseLeave={stopRepeating}
            onTouchStart={(e) => { e.preventDefault(); startRepeating(-step); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeating(); }}
            className="p-1 px-2 bg-muted rounded hover:bg-primary/20 hover:text-primary transition-colors text-xs font-bold cursor-pointer select-none active:scale-95"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            value={inputs[field] as number}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              setInputs(prev => ({ ...prev, [field]: Math.min(max, Math.max(min, val)) }));
            }}
            className="bg-transparent w-20 outline-none text-sm font-mono text-primary font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button 
            onMouseDown={() => startRepeating(step)}
            onMouseUp={stopRepeating}
            onMouseLeave={stopRepeating}
            onTouchStart={(e) => { e.preventDefault(); startRepeating(step); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeating(); }}
            className="p-1 px-2 bg-muted rounded hover:bg-primary/20 hover:text-primary transition-colors text-xs font-bold cursor-pointer select-none active:scale-95"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span className={`${suffix === '%' ? 'text-xl' : 'text-sm'} text-primary font-mono font-black`}>{suffix}</span>
      </div>
    </div>
  );
});

export default function InputPanel({ inputs, setInputs, ventureText, setVentureText, onRun, isProcessing, livePrice }: Props) {
  const [inputMode, setInputMode] = useState<'file' | 'text'>('text');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVentureText(`Reference Document: ${file.name}\n(System would parse content here)`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="space-y-4">
        <div className="block">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black neon-text-blue">Venture Input</span>
            <div className="flex bg-muted rounded-md p-0.5">
              <button 
                onClick={() => setInputMode('text')}
                className={`p-1 rounded ${inputMode === 'text' ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}
              >
                <Type className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setInputMode('file')}
                className={`p-1 rounded ${inputMode === 'file' ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>
          </div>

          {inputMode === 'text' ? (
            <textarea
              value={ventureText}
              onChange={(e) => setVentureText(e.target.value)}
              placeholder="Paste business outline or source details here..."
              className="w-full h-24 bg-card border border-border rounded-lg p-3 text-[11px] font-mono outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
            />
          ) : (
            <label className="p-3 border border-dashed border-primary/20 rounded-lg bg-primary/5 flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold font-mono">DOC</div>
              <div className="flex-1">
                <p className="text-xs font-medium truncate">{ventureText ? "Document attached" : "Upload source doc"}</p>
                <p className="text-[10px] text-[#8E9299]">PDF, Word, or TXT</p>
              </div>
            </label>
          )}
        </div>

        {/* Market Status for Mobile/Tablet */}
        <div className="lg:hidden bg-primary/5 p-4 rounded-xl border border-primary shadow-lg transition-all mt-2 mb-6">
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
            <div className="text-right">
              <span className="block text-sm font-mono font-black text-primary neon-text-blue">
                {livePrice ? `$${livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'N/A'}
              </span>
              <span className="text-[8px] text-gray-500 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black neon-text-blue">Shipping & CIF Model</p>
            <div className="flex bg-card border border-border rounded-md overflow-hidden">
              <button 
                onClick={() => setInputs(prev => ({ ...prev, cifMode: 'PRE', contingencyPercent: 1.5 }))}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-all duration-200 ${inputs.cifMode === 'PRE' ? 'neon-text-blue bg-primary/10' : 'text-gray-500 hover:text-gray-400'}`}
              >
                Pre Full CIF
              </button>
              <button 
                onClick={() => setInputs(prev => ({ ...prev, cifMode: 'AFTER', contingencyPercent: 1.2 }))}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-all duration-200 ${inputs.cifMode === 'AFTER' ? 'neon-text-blue bg-primary/10' : 'text-gray-500 hover:text-gray-400'}`}
              >
                After Full CIF
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <InputField label="Trade Volume" field="purchaseVolumeKg" min={1} max={500} step={1} suffix="KG" inputs={inputs} setInputs={setInputs} />
            <InputField label="Refinery Yield" field="refineryYieldPercent" min={90} max={100} step={0.1} suffix="%" inputs={inputs} setInputs={setInputs} />
            <InputField label="Mine Price" field="purchasePricePerKg" min={30000} max={200000} step={100} suffix="USD/KG" inputs={inputs} setInputs={setInputs} />
            <div className="relative group">
              <InputField label="LME Market Price" field="lmePricePerKg" min={30000} max={250000} step={100} suffix="USD/KG" inputs={inputs} setInputs={setInputs} />
              {livePrice && (
                <button 
                  onClick={() => setInputs(prev => ({ ...prev, lmePricePerKg: Math.round(livePrice) }))}
                  className="absolute right-3 top-2 text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 border border-primary/30"
                >
                  <RefreshCw className="w-2 h-2" />
                  SYNC LIVE
                </button>
              )}
            </div>
            
            <div className="h-px bg-border my-4" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black neon-text-blue px-1">Upfront Costs</p>
            
            {inputs.cifMode === 'PRE' && (
              <>
                <InputField label="Advance Deposit" field="advanceDepositPerKg" min={0} max={10000} step={100} suffix="USD/KG" inputs={inputs} setInputs={setInputs} />
                <InputField label="Insurance" field="insurancePerKg" min={0} max={5000} step={50} suffix="USD/KG" inputs={inputs} setInputs={setInputs} />
              </>
            )}
            
            <InputField label="Commissions" field="intermediaryCommissionsPerKg" min={0} max={10000} step={100} suffix="USD/KG" inputs={inputs} setInputs={setInputs} />
            <InputField label="OPEX (Travel/Rep)" field="opexFixed" min={0} max={200000} step={1000} suffix="USD" inputs={inputs} setInputs={setInputs} />
            <InputField label="Contingency" field="contingencyPercent" min={0} max={10} step={0.1} suffix="%" inputs={inputs} setInputs={setInputs} />
            <InputField label="Trader Premium" field="refineryTakePercent" min={0} max={10} step={0.1} suffix="%" inputs={inputs} setInputs={setInputs} />
          </div>
        </div>

        <div className="p-3 rounded bg-muted/30 border border-border text-[10px] leading-relaxed text-muted-foreground">
          Notice: Selling price is fixed at <span className="text-secondary font-bold">LME - 3%</span> per refinery collaboration protocols in Dubai (DGCX).
        </div>

        <button
          onClick={onRun}
          disabled={isProcessing}
          className="w-full mt-4 py-4 bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              SIMULATING MODEL
            </span>
          ) : (
            'RUN REVENUE SIMULATION'
          )}
        </button>
      </div>
    </motion.div>
  );
}
