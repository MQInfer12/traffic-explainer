import { Route, useRouteContext } from "../contexts/route";
import { twClass } from "../utils/twClass";

interface Props {
  to: Route;
  children: string;
}

const Link = ({ to, children }: Props) => {
  const { route, setRoute } = useRouteContext();

  const active = route === to;

  return (
    <button
      className={twClass(
        "px-3 border-b-4 transition-[border] duration-300",
        active ? " border-primary-500" : "border-transparent"
      )}
      onClick={() => setRoute(to)}
    >
      {children}
    </button>
  );
};

export default Link;
