import Layout from "./components/layout";
import Table from "./pages/table";
import Map from "./pages/map";
import { useRouteContext } from "./contexts/route";
import { useEffect, useState } from "react";
import { WebRequest } from "./interfaces/webRequest";
import Data from "./mocks/data.json";

interface Message {
  type: string;
  details: WebRequest;
}

function App() {
  const { route } = useRouteContext();
  const [requests, setRequests] = useState<WebRequest[]>([]);

  useEffect(() => {
    //@ts-ignore
    const browserAPI = chrome.runtime;
    if (browserAPI) {
      browserAPI.onMessage.addListener(function (message: Message) {
        if (message.type === "request") {
          /*  console.log("Received request details:", message.details); */
          setRequests((old) => [...old, message.details]);
        }
      });
    } else {
      setRequests(Data as WebRequest[]);
    }
  }, []);

  console.log(requests);

  return (
    <Layout>
      {
        {
          table: <Table requests={requests} />,
          map: <Map />,
        }[route]
      }
    </Layout>
  );
}

export default App;
