interface Props {
  children?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-amber-600 tracking-wider font-bold px-2 text-[12px] rounded-lg text-white cursor-pointer hover:opacity-80 transition-all duration-300 disabled:bg-gray-200 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
};

export default Button;
