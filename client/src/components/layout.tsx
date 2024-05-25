import { SetState } from "../interfaces/setState";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
  setOpenChat: SetState<boolean>;
}

const Layout = ({ children, setOpenChat }: Props) => {
  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col">
      <Navbar setOpenChat={setOpenChat} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
