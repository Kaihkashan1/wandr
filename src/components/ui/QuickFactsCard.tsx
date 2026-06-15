import { t } from "@/lib/i18n";
import { EditableField } from "@/components/preview/EditableField";
import type { Locale, QuickFacts } from "@/types";

interface QuickFactsCardProps {
  facts: QuickFacts;
  locale: Locale;
  contentId: string;
  preview?: boolean;
}

export function QuickFactsCard({ facts, locale, contentId, preview }: QuickFactsCardProps) {
  const rows = [
    { key: "region" as const, label: t(locale, "region"), value: facts.region },
    { key: "country" as const, label: t(locale, "country"), value: facts.country },
    { key: "climate" as const, label: t(locale, "climate"), value: facts.climate },
  ];

  return (
    <EditableField fieldId={contentId} fieldName="quickFacts" enabled={preview ?? false}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 sticky top-20">
        <h3 className="font-bold text-gray-900">{t(locale, "quickFacts")}</h3>
        <dl className="space-y-3 text-sm">
          {rows.map(
            (row) =>
              row.value && (
                <div key={row.key} className="flex justify-between gap-4">
                  <dt className="text-gray-500 shrink-0">{row.label}</dt>
                  <dd className="font-semibold text-right">{row.value}</dd>
                </div>
              )
          )}
          {facts.bestTimeToVisit && (
            <div className="pt-3 border-t border-gray-100">
              <dt className="text-gray-500 mb-1">{t(locale, "bestTimeToVisit")}</dt>
              <dd className="font-semibold text-wandr-600">{facts.bestTimeToVisit}</dd>
            </div>
          )}
        </dl>
      </div>
    </EditableField>
  );
}
