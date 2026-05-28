import DashboardLayout from "@/layouts/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Documents
        </h1>

        <p className="text-foreground/70">
          Enterprise document management system will be implemented here.
        </p>
      </div>
    </DashboardLayout>
  );
}