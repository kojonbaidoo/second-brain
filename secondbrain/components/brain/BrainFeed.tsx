import BrainItemCard, { type BrainFeedItem } from "./BrainItemCard";

export default function BrainFeed({
  items,
  onDelete,
}: {
  items: BrainFeedItem[];
  onDelete?: (item: BrainFeedItem) => void;
}) {
  return (
    <section className="mx-auto max-w-5xl px-0 pb-28 pt-20 sm:pt-24">
      {items.length === 0 ? (
        <div className="px-6 py-24 text-center text-sm text-slate-400 sm:px-8">
          Start building your Second Brain by clicking +
        </div>
      ) : (
        <div className="overflow-hidden rounded-none bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          {items.map((item) => (
            <BrainItemCard key={item.id} item={item} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
