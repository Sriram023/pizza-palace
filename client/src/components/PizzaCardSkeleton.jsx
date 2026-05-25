export default function PizzaCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3]"/>
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded"/>
        <div className="skeleton h-3 w-full rounded"/>
        <div className="skeleton h-3 w-2/3 rounded"/>
        <div className="skeleton h-9 w-32 rounded-xl mt-2"/>
      </div>
    </div>
  );
}