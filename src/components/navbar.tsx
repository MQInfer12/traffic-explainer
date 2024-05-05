import Link from "./link";

const Navbar = () => {
  return (
    <header className="h-14 bg-gray-800 text-white flex px-6">
      <nav className="h-full flex">
        <Link to="table">Tabla</Link>
        <Link to="map">Mapa</Link>
      </nav>
    </header>
  );
};

export default Navbar;
