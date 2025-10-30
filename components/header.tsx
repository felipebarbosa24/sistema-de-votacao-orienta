interface HeaderProps {
  title: string
  variant?: "student" | "admin"
}

export function Header({ title, variant = "student" }: HeaderProps) {
  return (
    <header className="bg-[#1e237e] text-white py-8 px-4 shadow-md">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wide uppercase">{title}</h1>
      </div>
    </header>
  )
}
