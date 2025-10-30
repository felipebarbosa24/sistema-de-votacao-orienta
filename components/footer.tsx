export function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="border-t border-neutral-200 py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="text-sm font-semibold text-neutral-700">CAPIVARA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2196F3] flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="text-sm font-semibold text-neutral-700">FACEPE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF9800] flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <span className="text-sm font-semibold text-neutral-700">ORIENTA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1e237e] py-2 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs text-white text-center">ORIENTA 2025 - TODOS OS DIREITOS RESERVADOS</p>
        </div>
      </div>
    </footer>
  )
}
