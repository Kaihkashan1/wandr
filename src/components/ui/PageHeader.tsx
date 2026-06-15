interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-glow" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-6">
        <p className="section-label text-white/40 mb-3">{label}</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
