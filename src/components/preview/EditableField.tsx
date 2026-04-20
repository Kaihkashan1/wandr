"use client";

import { useCallback } from "react";

interface EditableFieldProps {
  children: React.ReactNode;
  fieldId: string;
  fieldName: string;
  enabled: boolean;
}

export function EditableField({
  children,
  fieldId,
  fieldName,
  enabled,
}: EditableFieldProps) {
  const handleClick = useCallback(() => {
    if (!enabled) return;
    // postMessage to the Hygraph app-sdk preview panel
    window.parent.postMessage(
      {
        type: "hygraph:field:focus",
        payload: { entryId: fieldId, fieldApiId: fieldName },
      },
      "https://app.hygraph.com"
    );
  }, [enabled, fieldId, fieldName]);

  if (!enabled) return <>{children}</>;

  return (
    <div
      className="relative cursor-pointer group"
      data-hygraph-field={fieldName}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Edit ${fieldName} in Hygraph`}
    >
      {children}
      {/* Edit indicator */}
      <span className="absolute -top-2 -right-2 hidden group-hover:flex items-center gap-1 bg-blue-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full pointer-events-none z-10 whitespace-nowrap">
        Edit {fieldName}
      </span>
    </div>
  );
}
