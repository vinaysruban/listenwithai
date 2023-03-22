import Interface from "@/components/interface";

export default async function Home() {
  return (
    <main>
      <section className="flex flex-col place-items-center">
        <h1 className="font-extrabold text-4xl text-slate-900 my-4">
          Hello World!
        </h1>
        <Interface />
      </section>
    </main>
  );
}
