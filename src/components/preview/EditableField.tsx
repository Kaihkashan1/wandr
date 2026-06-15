"use client";

import {
  createComponentChainLink,
  createPreviewAttributes,
  type ComponentChainLink,
} from "@hygraph/preview-sdk/core";

interface EditableFieldProps {
  children: React.ReactNode;
  entryId: string;
  fieldApiId: string;
  enabled: boolean;
  richTextFormat?: "html" | "markdown" | "text";
  /** Parent component field apiId (e.g. quickFacts) */
  componentFieldApiId?: string;
  /** Component instance id from GraphQL */
  componentInstanceId?: string;
}

export function EditableField({
  children,
  entryId,
  fieldApiId,
  enabled,
  richTextFormat,
  componentFieldApiId,
  componentInstanceId,
}: EditableFieldProps) {
  if (!enabled) return <>{children}</>;

  const componentChain: ComponentChainLink[] | undefined =
    componentFieldApiId && componentInstanceId
      ? [createComponentChainLink(componentFieldApiId, componentInstanceId)]
      : undefined;

  const attrs = createPreviewAttributes({
    entryId,
    fieldApiId,
    componentChain,
  });

  return (
    <div
      {...attrs}
      {...(richTextFormat
        ? { "data-hygraph-rich-text-format": richTextFormat }
        : {})}
    >
      {children}
    </div>
  );
}
