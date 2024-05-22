interface Props {
  children?: string;
}

const Button = ({ children }: Props) => {
  return (
    <button className="bg-amber-500 px-2 text-[12px] rounded-md text-white cursor-pointer hover:opacity-80 transition-all duration-300">
      {children}
    </button>
  );
};

export default Button;
