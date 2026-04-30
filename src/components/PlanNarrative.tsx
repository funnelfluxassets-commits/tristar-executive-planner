import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Sparkles, Loader2, Download } from "lucide-react";
import { generateBusinessPlan } from "../services/geminiService";
import { TradeInputs, TradeResult } from "../services/goldTrade";

interface Props {
  inputs: TradeInputs;
  results: TradeResult;
  ventureText: string;
  theme: 'dark' | 'light';
}

export default function PlanNarrative({ inputs, results, ventureText, theme }: Props) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const plan = await generateBusinessPlan(inputs, results, ventureText);
    setContent(plan);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="text-primary w-6 h-6" />
            STRATEGIC BUSINESS PLAN
          </h2>
          <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-bold opacity-60">AI-generated narrative architecture based on financial model #VNT-0094.</p>
        </div>
        
        {!content ? (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'dark' ? 'shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'shadow-md'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                GENERATING DRAFT...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                GENERATE BUSINESS PLAN
              </>
            )}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> REGENERATE
            </button>
            <button
              className="bg-secondary text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            >
              <Download className="w-4 h-4" /> EXPORT PDF
            </button>
          </div>
        )}
      </div>

      <div className="min-h-[400px] relative">
        {!content && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">System Ready for Analysis</h3>
            <p className="max-w-md text-xs uppercase tracking-wider leading-relaxed">
              Adjust your parameters in the left panel and initiate the generation process to create a comprehensive strategic business model narrative.
            </p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-bold mb-2 neon-text-blue uppercase tracking-tighter">AI AGENT: SYNTHESIZING OPERATIONS</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">Running logistics simulation and risk weighting...</p>
          </div>
        )}

        {content && (
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none prose-headings:text-primary prose-strong:text-secondary prose-p:text-muted-foreground prose-li:text-muted-foreground animate-in fade-in duration-700`}>
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mb-6 uppercase tracking-tight neon-text-blue">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2 text-primary uppercase tracking-widest">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold mt-8 mb-3 text-secondary uppercase tracking-[0.2em]">{line.replace('### ', '')}</h3>;
              if (line.trim() === '') return <br key={i} />;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-2 text-sm">{line.replace('- ', '')}</li>;
              return <p key={i} className="mb-4 leading-relaxed text-sm">{line}</p>;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
