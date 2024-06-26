import { createContext, useContext, useState } from "react";
import { SetState } from "../interfaces/setState";

export type Route = "table" | "map";

interface Context {
  route: Route;
  setRoute: SetState<Route>;
}

export const RouteContext = createContext<Context | null>(null);

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a RouteContextProvider");
  }
  return context;
};

export const RouteContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [route, setRoute] = useState<Route>("table");

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {children}
    </RouteContext.Provider>
  );
};
