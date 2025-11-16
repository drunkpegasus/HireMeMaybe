export default function PageNotFound() {
  return (
    <div className="flex min-h-[700px] items-center justify-center md:max-h-[600px]">
      {/* Changes:
        1. Changed 'flex items-center' to 'flex flex-col' to stack items.
        2. Removed the <span>:</span>.
        3. Moved text styling to the children for better control.
      */}
      <div className="-mt-40 flex flex-col items-center gap-4 py-8 text-accent">
        <h1 className="text-6xl font-bold md:text-8xl">404</h1>
        <span className="text-2xl font-semibold md:text-3xl">
          The path less travelled leads to an unknown destination.
        </span>
      </div>
    </div>
  );
}
