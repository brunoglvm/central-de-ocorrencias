export default function PrettierTest() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-8 text-white">
      <section className="w-full max-w-md rounded-xl bg-slate-800 p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-blue-400">Prettier + Tailwind</h1>

        <p className="mb-6 leading-relaxed text-gray-300">
          Este arquivo serve para testar a ordenação automática das classes.
        </p>

        <button className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600">
          Testar
        </button>
      </section>
    </main>
  )
}
