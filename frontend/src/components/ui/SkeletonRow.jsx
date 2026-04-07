export default function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-zinc-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 rounded w-3/4 animate-shimmer" />
        </td>
      ))}
    </tr>
  );
}
