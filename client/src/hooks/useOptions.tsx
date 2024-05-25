import { autoUpdate, flip, useFloating } from "@floating-ui/react";
import { useState } from "react";
import Options from "../components/options";

export interface Option {
  title: string;
  onClick: () => void;
}

export const useOptions = (opts: Option[], onClose: () => void) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "right-start",
    open: open,
    whileElementsMounted: autoUpdate,
    middleware: [flip()],
  });

  const options = (
    <Options
      close={() => {
        setOpen(false);
        onClose();
      }}
      options={opts}
      ref={refs.setFloating}
      floatingStyles={floatingStyles}
      open={open}
    />
  );

  return { setOpen, options, setReference: refs.setReference };
};
