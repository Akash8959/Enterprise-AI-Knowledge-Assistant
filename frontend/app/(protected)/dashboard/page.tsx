import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>

        <h1 className="text-4xl font-bold mb-4">
          Welcome to E-AI KA 🚀
        </h1>

        <p className="text-foreground/70">
          Enterprise AI Knowledge Assistant Dashboard Initialized Successfully.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* Documents Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-2">
              Documents
            </h2>

            <p className="text-foreground/70">
              Manage enterprise knowledge documents.
            </p>
          </Card>

          {/* AI Chat Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-2">
              AI Chat
            </h2>

            <p className="text-foreground/70">
              Interact with your enterprise AI assistant.
            </p>
          </Card>

          {/* Analytics Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-2">
              Analytics
            </h2>

            <p className="text-foreground/70">
              Monitor AI usage and document insights.
            </p>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}