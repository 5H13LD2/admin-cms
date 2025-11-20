import { ModuleCard } from "@/components/cards/ModuleCard";
import { modules } from "@/data/dummyData";

export default function Modules() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modules</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and continue your learning journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>
    </div>
  );
}
