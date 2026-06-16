import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_PROMPTS } from "../graphql/prompts";

type Prompt = {
    id: string;
    name: string;
    description?: string | null;
    activeVersionId?: string | null;
    createdAt: string;
    updatedAt: string;
};

type PromptsQueryData = {
    prompts: Prompt[];
};

export function PromptList() {
    const { data, loading, error } = useQuery<PromptsQueryData>(GET_PROMPTS);

    if (loading) {
        return <div className="p-4 text-sm text-gray-600">Loading prompts...</div>;
    }

    if (error) {
        return (
            <div className="p-4 text-sm text-red-600">
                Error: {error.message}
            </div>
        );
    }

    const prompts = data?.prompts ?? [];

    if (prompts.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
                <h2 className="text-lg font-semibold">No prompts yet</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Create your first prompt to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-3">
            {prompts.map((prompt) => (
                <div
                    key={prompt.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                <Link to={`/prompts/${prompt.id}`} className="hover:underline">
                                    {prompt.name}
                                </Link>
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {prompt.description || "No description"}
                            </p>
                        </div>

                        <div className="text-xs text-gray-500">ID {prompt.id}</div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                        Active version: {prompt.activeVersionId ?? "none"}
                    </div>
                </div>
            ))}
        </div>
    );
}