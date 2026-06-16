import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROMPT_VERSION, PROMOTE_PROMPT_VERSION } from "../graphql/mutations";
import { GET_PROMPT } from "../graphql/queries";

type PromptVersion = {
  id: string;
  versionNumber: number;
  template: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
};

type Props = {
  promptId: string;
  activeVersionId?: string | null;
  versions: PromptVersion[];
};

export function PromptVersionEditor({ promptId, activeVersionId, versions }: Props) {
  const [template, setTemplate] = useState("");

  const [createPromptVersion, { loading: creating, error: createError }] = useMutation(
    CREATE_PROMPT_VERSION,
    {
      refetchQueries: [{ query: GET_PROMPT, variables: { id: promptId } }],
      awaitRefetchQueries: true,
    }
  );

  const [promotePromptVersion, { loading: promoting, error: promoteError }] = useMutation(
    PROMOTE_PROMPT_VERSION,
    {
      refetchQueries: [{ query: GET_PROMPT, variables: { id: promptId } }],
      awaitRefetchQueries: true,
    }
  );

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!template.trim()) return;

    await createPromptVersion({
      variables: {
        promptId,
        input: {
          template,
        },
      },
    });

    setTemplate("");
  }

  async function handlePromote(promptVersionId: string) {
    await promotePromptVersion({
      variables: {
        promptVersionId,
      },
    });
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div>
        <h2 className="text-xl font-semibold">Versions</h2>
        <p className="text-sm text-slate-400">
          Active version: {activeVersionId ?? "none"}
        </p>
      </div>

      <div className="space-y-2">
        {versions.length === 0 ? (
          <p className="text-sm text-slate-400">No versions yet.</p>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-3"
            >
              <div className="space-y-1">
                <div className="font-medium">
                  v{version.versionNumber}{" "}
                  <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-xs uppercase tracking-wide text-slate-300">
                    {version.status}
                  </span>
                  {activeVersionId === version.id ? (
                    <span className="ml-2 rounded bg-emerald-900 px-2 py-0.5 text-xs text-emerald-200">
                      Active
                    </span>
                  ) : null}
                </div>
                <pre className="whitespace-pre-wrap break-words text-sm text-slate-300">
                  {version.template}
                </pre>
              </div>

              {version.status !== "ACTIVE" ? (
                <button
                  type="button"
                  onClick={() => handlePromote(version.id)}
                  disabled={promoting}
                  className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {promoting ? "Promoting..." : "Promote"}
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleCreate} className="space-y-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
        <h3 className="font-medium">Create new version</h3>

        <textarea
          className="min-h-40 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm outline-none"
          placeholder="New version template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />

        <button
          type="submit"
          disabled={creating || !template.trim()}
          className="rounded-lg bg-white px-4 py-2 font-medium text-slate-950 disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create version"}
        </button>

        {createError ? (
          <p className="text-sm text-red-400">{createError.message}</p>
        ) : null}
        {promoteError ? (
          <p className="text-sm text-red-400">{promoteError.message}</p>
        ) : null}
      </form>
    </section>
  );
}