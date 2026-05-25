export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card p-10 text-center flex flex-col items-center gap-3">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand grid place-items-center">
          <Icon size={26}/>
        </div>
      )}
      <h3 className="font-bold text-lg">{title}</h3>
      {message && <p className="text-ink/60 max-w-sm">{message}</p>}
      {action}
    </div>
  );
}