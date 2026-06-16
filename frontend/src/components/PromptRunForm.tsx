import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { RUN_PROMPT } from "../graphql/mutations";
import { GET_PROMPT } from "../graphql/queries";

type PromptVersion = {
  id: string;
  versionNumber: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
};

type Props = {
  promptId: string;
  versions: PromptVersion[];
};

type RunPromptMutationData = {
  runPrompt: {
    id: string;
    input: string;
    output: string;
    executionTime: number;
    createdAt: string;
  };
};

type RunPromptMutationVars = {
  promptVersionId: string;
  input: {
    input: string;
  };
};

export function PromptRunForm({ promptId, versions }: Props) {
  const [promptVersionId, setPromptVersionId] = useState("");
  const [input, setInput] = useState("");
  const [lastOutput, setLastOutput] = useState<string>("");

  const defaultVersionId = useMemo(() => {
    return versions.find((v) => v.status === "ACTIVE")?.id ?? versions[0]?.id ?? "";
  }, [versions]);

  const [runPrompt, { loading, error }] = useMutation<
    RunPromptMutationData,
    RunPromptMutationVars
  >(RUN_PROMPT, {
    refetchQueries: [{ query: GET_PROMPT, variables: { id: promptId } }],
    awaitRefetchQueries: true,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const versionId = promptVersionId || defaultVersionId;
    if (!versionId || !input.trim()) return;

    const result = await runPrompt({
      variables: {
        promptVersionId: versionId,
        input: { input },
      },
    });

    setLastOutput(result.data?.runPrompt?.output ?? "");
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div>
        <h2 className="text-xl font-semibold">Run Prompt</h2>
        <p className="text-sm text-slate-400">Test a version with sample input.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
          value={promptVersionId}
          onChange={(e) => setPromptVersionId(e.target.value)}
        >
          <option value="">
            {defaultVersionId ? "Use active version" : "Select version"}
          </option>
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              v{version.versionNumber} ({version.status})
            </option>
          ))}
        </select>

        <textarea
          className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm outline-none"
          placeholder="Input text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading || !input.trim() || (!promptVersionId && !defaultVersionId)}
          className="rounded-lg bg-white px-4 py-2 font-medium text-slate-950 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run prompt"}
        </button>

        {error ? <p className="text-sm text-red-400">{error.message}</p> : null}
      </form>

      {lastOutput ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
          <h3 className="mb-2 font-medium">Latest output</h3>
          <pre className="whitespace-pre-wrap break-words text-sm text-slate-300">
            {lastOutput}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
