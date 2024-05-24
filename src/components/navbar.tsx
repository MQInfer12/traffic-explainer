import { SetState } from "../interfaces/setState";
import ButtonIcon from "./buttonIcon";
import Link from "./link";

interface Props {
  setOpenChat: SetState<boolean>;
}

const Navbar = ({ setOpenChat }: Props) => {
  return (
    <header className="h-14 bg-gray-800 text-white flex px-6 justify-between items-center">
      <nav className="h-full flex">
        <Link to="table">Tabla</Link>
        <Link to="map">Mapa</Link>
      </nav>
      <ButtonIcon onClick={() => setOpenChat(true)} icon="chat" />
    </header>
  );
};

export default Navbar;
