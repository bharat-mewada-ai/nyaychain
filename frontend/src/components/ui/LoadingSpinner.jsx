export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-zinc-200 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-zinc-500 text-sm">{text}</p>}
    </div>
  );
}
