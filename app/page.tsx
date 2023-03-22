import Interface from "@/components/interface";

export default async function Home() {
  return (
    <main>
      <section className="flex flex-col place-items-center">
        <h1 className="font-extrabold text-4xl text-slate-900 my-4">Hello World!</h1>
        <h2 className="font-extrabold text-2xl text-slate-800 my-2">Input your file here!</h2>
        <Interface />
      </section>
    </main>
  );
}
