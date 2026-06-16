type PromptRun = {
  id: string;
  input: string;
  output: string;
  executionTime: number;
  createdAt: string;
};

type PromptVersion = {
  id: string;
  versionNumber: number;
  runs?: PromptRun[];
};

type Props = {
  versions: PromptVersion[];
};

export function PromptRunHistory({ versions }: Props) {
  const runs = versions.flatMap((version) =>
    (version.runs ?? []).map((run) => ({
      ...run,
      versionNumber: version.versionNumber,
    }))
  );

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div>
        <h2 className="text-xl font-semibold">Run history</h2>
        <p className="text-sm text-slate-400">Recent prompt executions.</p>
      </div>

      {runs.length === 0 ? (
        <p className="text-sm text-slate-400">No runs yet.</p>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <article key={run.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div className="mb-2 text-sm text-slate-400">
                v{run.versionNumber} · {run.executionTime} ms · {run.createdAt}
              </div>
              <div className="mb-2">
                <div className="text-xs uppercase tracking-wide text-slate-500">Input</div>
                <pre className="whitespace-pre-wrap break-words text-sm text-slate-200">
                  {run.input}
                </pre>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Output</div>
                <pre className="whitespace-pre-wrap break-words text-sm text-slate-200">
                  {run.output}
                </pre>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}