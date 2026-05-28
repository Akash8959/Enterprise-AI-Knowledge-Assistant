import DashboardLayout from "@/layouts/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Settings
        </h1>

        <p className="text-foreground/70">
          Application settings and preferences will be implemented here.
        </p>
      </div>
    </DashboardLayout>
  );
}