import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROMPT, GET_PROMPTS } from "../graphql/prompts";

type CreatePromptResponse = {
    createPrompt: {
        id: string;
        name: string;
        description?: string | null;
        activeVersionId?: string | null;
        createdAt: string;
        updatedAt: string;
    };
};

type CreatePromptVars = {
    input: {
        name: string;
        description?: string | null;
    };
};

export function CreatePromptForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [createPrompt, { loading, error }] = useMutation<
        CreatePromptResponse,
        CreatePromptVars
    >(CREATE_PROMPT, {
        refetchQueries: [{ query: GET_PROMPTS }],
        awaitRefetchQueries: true,
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await createPrompt({
            variables: {
                input: {
                    name,
                    description: description || null,
                },
            },
        });

        setName("");
        setDescription("");
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border p-4">
            <input
                className="rounded border px-3 py-2"
                placeholder="Prompt name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                className="rounded border px-3 py-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading || !name.trim()}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Prompt"}
            </button>

            {error && <div className="text-sm text-red-600">{error.message}</div>}
        </form>
    );
}