"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI RAG & Search Analytics</h1>
        <p className="text-foreground/60 mt-1">
          Monitor vector database performance, query latency, and knowledge retrieval metrics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase">Average RAG Latency</div>
          <div className="text-3xl font-bold text-foreground mt-2">142 ms</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">⚡ Fast vector search</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase">Retrieval Precision</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">98.4%</div>
          <span className="text-[11px] text-foreground/50">Top-4 chunk relevance</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase">Embedding Dimension</div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">384</div>
          <span className="text-[11px] text-foreground/50">all-MiniLM-L6-v2</span>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="text-xs font-semibold text-foreground/60 uppercase">Citations Grounding</div>
          <div className="text-3xl font-bold text-foreground mt-2">100%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Strict context prompt</span>
        </div>
      </div>

      {/* Analytics Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Knowledge Ingestion Distribution</h2>
          <p className="text-xs text-foreground/60 mb-6">File format breakdown indexed in ChromaDB</p>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>PDF Documents (.pdf)</span>
                <span>65%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-indigo-600 w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Plain Text (.txt)</span>
                <span>25%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Word Documents (.docx)</span>
                <span>10%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-amber-500 w-[10%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Department Query Volume</h2>
          <p className="text-xs text-foreground/60 mb-6">Active RAG queries by department</p>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Engineering & Product</span>
                <span>45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-indigo-600 w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Human Resources</span>
                <span>30%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-violet-600 w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Finance & Legal</span>
                <span>25%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-sky-500 w-[25%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}