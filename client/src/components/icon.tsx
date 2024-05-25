import IconChat from "../icons/iconChat";
import IconTrash from "../icons/iconTrash";
import IconX from "../icons/iconX";

export type TIcon = "chat" | "x" | "trash";

interface Props {
  type: TIcon;
}

const Icon = ({ type }: Props) => {
  const icons: Record<TIcon, JSX.Element> = {
    chat: <IconChat />,
    x: <IconX />,
    trash: <IconTrash />,
  };

  return icons[type];
};

export default Icon;
