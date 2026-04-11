export default function BrainItemCard({ item }: { item: any }) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      
      {/* Type label */}
      <div className="text-xs text-gray-400 mb-2 uppercase">
        {item.type}
      </div>

      {/* Content rendering */}
      {item.type === "text" && (
        <p className="text-gray-800">{item.content}</p>
      )}

      {item.type === "image" && (
        <img
          src={item.url}
          className="rounded-lg max-h-96 object-cover"
        />
      )}

      {item.type === "audio" && (
        <audio controls className="w-full">
          <source src={item.url} />
        </audio>
      )}

      {item.type === "link" && (
        <a
          href={item.url}
          className="text-blue-500 underline"
          target="_blank"
        >
          {item.url}
        </a>
      )}

      {item.type === "file" && (
        <p className="text-sm text-gray-600">
          📎 File uploaded: {item.name}
        </p>
      )}
    </div>
  );
}
