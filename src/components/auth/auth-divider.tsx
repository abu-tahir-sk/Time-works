export function AuthDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/70" />
      </div>
      <div className="relative flex justify-center text-[10px] font-medium tracking-[0.18em] uppercase">
        <span className="bg-card px-2.5 text-muted-foreground dark:bg-[#171a21]">or continue with email</span>
      </div>
    </div>
  )
}
