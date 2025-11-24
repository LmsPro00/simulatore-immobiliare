import { Calculator } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
          <Calculator className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Simulatore Immobiliare
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Lead magnet per operazioni immobiliari
        </p>
        <div className="flex gap-4 justify-center">
          <span className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
            React 18
          </span>
          <span className="px-4 py-2 bg-accent text-white rounded-lg font-medium">
            TypeScript
          </span>
          <span className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium">
            TailwindCSS
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
