import { CreatePromptForm } from "../components/CreatePromptForm";
import { PromptList } from "../components/PromptList";

export default function DashboardPage() {
    return (
        <main className="mx-auto max-w-4xl p-6">
            <div>
                <h1 className="text-2xl font-bold">Prompt Management</h1>

                <p className="mt-2 text-gray-600">
                    Browse prompts and start managing versions.
                </p>
            </div>

            <div className="mt-6">
                <CreatePromptForm />
            </div>

            <div className="mt-6">
                <PromptList />
            </div>
        </main>
    );
}