import Layout from "./components/layout";
import Table from "./pages/table";
import Map from "./pages/map";
import { useRouteContext } from "./contexts/route";

function App() {
  const { route } = useRouteContext();

  return (
    <Layout>
      {
        {
          table: <Table />,
          map: <Map />,
        }[route]
      }
    </Layout>
  );
}

export default App;
