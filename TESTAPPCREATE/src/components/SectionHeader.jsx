export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">{eyebrow}</p> : null}
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
