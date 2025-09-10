"use client";

type Props = {
  viewMode: "grid" | "list";
  onToggleView: () => void;
};

export default function Toolbar({ viewMode, onToggleView }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <button className="btn-outline">Back</button>
      <button className="btn-outline">Upload</button>
      <button className="btn-outline">Add</button>

      <button onClick={onToggleView} className="btn-outline">
        {viewMode === "grid" ? "Grid" : "List"}
      </button>
    </div>
  );
}
