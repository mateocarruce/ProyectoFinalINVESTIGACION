import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-xl font-bold">Optimization App</h1>
        <div className="flex space-x-4">
          <Link className="text-white" href="/">Inicio</Link>
          <Link className="text-white" href="/linear">Lineal</Link>
          <Link className="text-white" href="/transport">Transporte</Link>
          <Link className="text-white" href="/network">Redes</Link>
        </div>
      </div>
    </nav>
  );
}
