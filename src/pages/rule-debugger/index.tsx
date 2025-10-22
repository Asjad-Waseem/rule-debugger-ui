import { DataTable, RulePanel } from "@src/components";

const RuleDebuggerPage = () => {
  return (
    <section className="flex flex-col">
      <RulePanel />
      <DataTable />
    </section>
  );
};

export default RuleDebuggerPage;
