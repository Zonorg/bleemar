import Link from "next/link";
export default function notFound() {
  return (
    <div className="w-full h-4/5 py-20 flex flex-col justify-start items-center max-md:py-0 max-md:h-3/4">
      <div className="w-2/3 flex flex-col items-center gap-5 max-md:w-11/12">
        <h1 className="text-8xl font-semibold max-md:text-5xl">404</h1>
        <p className="text-xl mt-10">La página que buscas no existe.</p>
        <Link
          href="/"
          className="bg-green-s font-medium text-white rounded px-4 py-2 hover:bg-green-m"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
