import React from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-10 px-4 bg-white/70 border border-white/40 rounded-2xl">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
