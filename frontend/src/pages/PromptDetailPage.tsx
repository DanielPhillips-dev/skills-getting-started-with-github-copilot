import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import {
    CREATE_PROMPT_VERSION,
    GET_PROMPT,
    GET_PROMPT_RUNS,
    PROMOTE_PROMPT_VERSION,
    RUN_PROMPT,
} from "../graphql/promptDetails";

type PromptVersionStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type PromptVersion = {
    id: string;
    versionNumber: number;
    template: string;
    status: PromptVersionStatus;
    createdAt: string;
    updatedAt: string;
};

type Prompt = {
    id: string;
    name: string;
    description?: string | null;
    activeVersionId?: string | null;
    versions: PromptVersion[];
};

type GetPromptData = {
    prompt: Prompt | null;
};

type GetPromptVars = {
    id: string;
};

type PromptRun = {
    id: string;
    input: string;
    output: string;
    executionTime: number;
    createdAt: string;
};

type GetRunsData = {
    promptRuns: PromptRun[];
};

type GetRunsVars = {
    promptVersionId: string;
};

type CreateVersionData = {
    createPromptVersion: PromptVersion;
};

type CreateVersionVars = {
    promptId: string;
    input: {
        template: string;
    };
};

type RunPromptData = {
    runPrompt: PromptRun;
};

type RunPromptVars = {
    promptVersionId: string;
    input: {
        input: string;
    };
};

type PromoteVersionData = {
    promotePromptVersion: PromptVersion;
};

type PromoteVersionVars = {
    promptVersionId: string;
};

export default function PromptDetailPage() {
    const { id } = useParams<{ id: string }>();
    const promptId = id ?? "";

    const { data, loading, error, refetch } = useQuery<GetPromptData, GetPromptVars>(
        GET_PROMPT,
        {
            variables: { id: promptId },
            skip: !promptId,
        }
    );

    const prompt = data?.prompt ?? null;

    const [selectedVersionId, setSelectedVersionId] = useState("");
    const [versionTemplate, setVersionTemplate] = useState("");
    const [runInput, setRunInput] = useState("");

    const [createVersion, { loading: creatingVersion }] = useMutation<
        CreateVersionData,
        CreateVersionVars
    >(CREATE_PROMPT_VERSION);

    const [runPrompt, { loading: runningPrompt }] = useMutation<
        RunPromptData,
        RunPromptVars
    >(RUN_PROMPT);

    const [promoteVersion, { loading: promotingVersion }] = useMutation<
        PromoteVersionData,
        PromoteVersionVars
    >(PROMOTE_PROMPT_VERSION);

    const selectedVersion = useMemo(() => {
        return prompt?.versions.find((version) => version.id === selectedVersionId) ?? null;
    }, [prompt, selectedVersionId]);

    useEffect(() => {
        if (!prompt) return;

        const fallbackVersionId = prompt.activeVersionId ?? prompt.versions[0]?.id ?? "";

        if (!selectedVersionId && fallbackVersionId) {
            setSelectedVersionId(fallbackVersionId);
        }
    }, [prompt, selectedVersionId]);

    const runsQuery = useQuery<GetRunsData, GetRunsVars>(GET_PROMPT_RUNS, {
        variables: { promptVersionId: selectedVersionId },
        skip: !selectedVersionId,
    });

    if (loading) return <div className="p-6">Loading prompt...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;
    if (!prompt) return <div className="p-6">Prompt not found.</div>;

    async function handleCreateVersion(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!versionTemplate.trim()) return;

        const result = await createVersion({
            variables: {
                promptId,
                input: {
                    template: versionTemplate,
                },
            },
        });

        const newVersionId = result.data?.createPromptVersion?.id;

        setVersionTemplate("");
        await refetch();

        if (newVersionId) {
            setSelectedVersionId(newVersionId);
        }
    }

    async function handleRunPrompt(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedVersionId || !runInput.trim()) return;

        await runPrompt({
            variables: {
                promptVersionId: selectedVersionId,
                input: {
                    input: runInput,
                },
            },
        });

        setRunInput("");
        await runsQuery.refetch();
    }

    async function handlePromoteVersion() {
        if (!selectedVersionId) return;

        await promoteVersion({
            variables: {
                promptVersionId: selectedVersionId,
            },
        });

        await refetch();
    }

    return (
        <main className="mx-auto max-w-5xl p-6">
            <div className="mb-4">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                    ← Back
                </Link>
            </div>

            <header className="rounded-xl border p-4">
                <h1 className="text-2xl font-bold">{prompt.name}</h1>
                <p className="mt-2 text-gray-600">{prompt.description || "No description"}</p>
                <div className="mt-3 text-sm text-gray-500">
                    Active version: {prompt.activeVersionId ?? "none"}
                </div>
            </header>

            <section className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Versions</h2>

                        <select
                            className="rounded border px-3 py-2 text-sm"
                            value={selectedVersionId}
                            onChange={(e) => setSelectedVersionId(e.target.value)}
                        >
                            <option value="">Select version</option>
                            {prompt.versions.map((version) => (
                                <option key={version.id} value={version.id}>
                                    v{version.versionNumber} ({version.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {prompt.versions.length === 0 ? (
                            <div className="text-sm text-gray-500">No versions yet.</div>
                        ) : (
                            prompt.versions.map((version) => (
                                <div
                                    key={version.id}
                                    className={`rounded-lg border p-3 ${
                                        version.id === selectedVersionId ? "border-blue-500" : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="font-medium">v{version.versionNumber}</div>
                                        <div className="text-xs uppercase text-gray-500">
                                            {version.status}
                                        </div>
                                    </div>
                                    <div className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                                        {version.template}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleCreateVersion} className="mt-4 space-y-2">
                        <textarea
                            className="w-full rounded border p-2"
                            rows={4}
                            placeholder="New version template"
                            value={versionTemplate}
                            onChange={(e) => setVersionTemplate(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={creatingVersion || !versionTemplate.trim()}
                            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {creatingVersion ? "Creating..." : "Create version"}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={handlePromoteVersion}
                        disabled={
                            promotingVersion ||
                            !selectedVersionId ||
                            selectedVersion?.status === "ACTIVE"
                        }
                        className="mt-3 rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {promotingVersion ? "Promoting..." : "Promote selected version"}
                    </button>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-lg font-semibold">Run Prompt</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Running:{" "}
                        {selectedVersion
                            ? `v${selectedVersion.versionNumber} (${selectedVersion.status})`
                            : "no version selected"}
                    </p>

                    <form onSubmit={handleRunPrompt} className="mt-4 space-y-2">
                        <textarea
                            className="w-full rounded border p-2"
                            rows={4}
                            placeholder="Input text"
                            value={runInput}
                            onChange={(e) => setRunInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={runningPrompt || !runInput.trim() || !selectedVersionId}
                            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {runningPrompt ? "Running..." : "Run prompt"}
                        </button>
                    </form>

                    <div className="mt-6">
                        <h3 className="font-semibold">
                            Run history {selectedVersion ? `for v${selectedVersion.versionNumber}` : ""}
                        </h3>

                        <div className="mt-3 grid gap-3">
                            {!selectedVersionId ? (
                                <div className="text-sm text-gray-500">
                                    Select a version to view runs.
                                </div>
                            ) : runsQuery.loading ? (
                                <div className="text-sm text-gray-500">Loading runs...</div>
                            ) : runsQuery.error ? (
                                <div className="text-sm text-red-600">
                                    {runsQuery.error.message}
                                </div>
                            ) : runsQuery.data?.promptRuns?.length ? (
                                runsQuery.data.promptRuns.map((run) => (
                                    <div key={run.id} className="rounded-lg border p-3">
                                        <div className="text-xs text-gray-500">
                                            {run.createdAt} · {run.executionTime} ms
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <div>
                                                <span className="font-medium">Input:</span>{" "}
                                                {run.input}
                                            </div>
                                            <div className="mt-1">
                                                <span className="font-medium">Output:</span>{" "}
                                                {run.output}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No runs yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}