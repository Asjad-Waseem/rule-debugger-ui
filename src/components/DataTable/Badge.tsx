import { FIRED, NO_FIRE } from "./constants";

const Badge = ({ fired }: { fired: boolean }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs ${
        fired
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {fired ? FIRED : NO_FIRE}
    </span>
  );
};

export default Badge;
