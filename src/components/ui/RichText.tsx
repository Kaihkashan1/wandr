import { RichText as HygraphRichText } from "@graphcms/rich-text-react-renderer";
import type { RichTextContent } from "@/types";

interface RichTextProps {
  content: RichTextContent | null | undefined;
}

export function RichText({ content }: RichTextProps) {
  if (!content?.raw) {
    return null;
  }
  return (
    <HygraphRichText
      content={
        content.raw as unknown as Parameters<typeof HygraphRichText>[0]["content"]
      }
    />
  );
}
