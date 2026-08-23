export function AuthDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-widest">
        <span className="bg-card px-3 text-secondary">or</span>
      </div>
    </div>
  );
}
