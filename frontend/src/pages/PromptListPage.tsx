import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PROMPTS } from "../graphql/prompts";
import { CreatePromptForm } from "../components/CreatePromptForm";

type Prompt = {
  id: string;
  name: string;
  description?: string | null;
  activeVersionId?: string | null;
};

type GetPromptsData = {
  prompts: Prompt[];
};

export default function PromptListPage() {
  const { data, loading, error } = useQuery<GetPromptsData>(GET_PROMPTS);

  if (loading) return <div className="p-6">Loading prompts...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading prompts.</div>;

  const prompts = data?.prompts ?? [];

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <CreatePromptForm />

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Link
            key={prompt.id}
            to={`/prompts/${prompt.id}`}
            className="block rounded border p-4 hover:border-blue-500 hover:bg-blue-50"
          >
            <h2 className="text-lg font-semibold">{prompt.name}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {prompt.description || "No description"}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Active version: {prompt.activeVersionId ?? "none"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}