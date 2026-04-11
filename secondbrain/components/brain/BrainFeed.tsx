import BrainItemCard from "./BrainItemCard";

export default function BrainFeed({ items }: { items: any[] }) {
  return (
    <div className="pt-20 px-6 pb-24 space-y-4">
      {items.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          Start building your Second Brain by clicking +
        </p>
      ) : (
        items.map((item) => (
          <BrainItemCard key={item.id} item={item} />
        ))
      )}
    </div>
  );
}
