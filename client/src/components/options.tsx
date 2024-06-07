import { CSSProperties, ElementRef, forwardRef } from "react";
import ButtonIcon from "./buttonIcon";
import { useDelayUnmount } from "../hooks/useDelayUnmount";
import { twClass } from "../utils/twClass";
import { createPortal } from "react-dom";
import { Option } from "../hooks/useOptions";

interface Props {
  open: boolean;
  floatingStyles: CSSProperties;
  close: () => void;
  options: Option[];
}

const Options = forwardRef<ElementRef<"div">, Props>(
  ({ floatingStyles, close, open, options }, ref) => {
    const render = useDelayUnmount(open, 300);
    if (!render) return null;
    return createPortal(
      <div
        className={twClass(
          "bg-white border border-gray-300 w-48 shadow-xl rounded-lg animate-[appear_.3s] transition-[opacity] duration-300",
          open ? "opacity-1" : "opacity-0"
        )}
        ref={ref}
        style={floatingStyles}
      >
        <div className="p-2 flex justify-between">
          <h3 className="font-extrabold text-amber-900">Opciones</h3>
          <ButtonIcon size="small" icon="x" onClick={close} />
        </div>
        <div className="flex flex-col">
          {options.map((o) => (
            <button
              key={o.title}
              onClick={() => {
                o.onClick();
                close();
              }}
              className="p-2 text-start hover:bg-amber-900/10 text-sm font-bold text-black/70 transition-all duration-300"
            >
              {o.title}
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
  }
);

export default Options;
