import { twClass } from "../utils/twClass";
import Icon, { TIcon } from "./icon";

interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon: TIcon;
  size?: "base" | "small";
  type?: "primary" | "secondary";
}

const ButtonIcon = ({
  onClick,
  icon,
  size = "base",
  type = "primary",
}: Props) => {
  return (
    <button
      className={twClass(
        "aspect-square p-1 rounded-md hover:opacity-80 transition-all duration-300 ",
        size === "base" ? "h-8" : "h-6",
        type === "primary" ? "bg-amber-600 text-white" : "text-amber-600"
      )}
      onClick={onClick}
    >
      <Icon type={icon} />
    </button>
  );
};

export default ButtonIcon;
