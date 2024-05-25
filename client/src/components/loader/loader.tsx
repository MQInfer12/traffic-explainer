import "./loader.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div className="loader" />
      <small className="font-bold text-black/80">Cargando...</small>
    </div>
  );
};

export default Loader;
