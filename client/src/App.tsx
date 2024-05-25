import Layout from "./components/layout";
import Table from "./pages/table";
import Map from "./pages/map";
import { useRouteContext } from "./contexts/route";
import { useEffect, useRef, useState } from "react";
import { WebRequest } from "./interfaces/webRequest";
import Data from "./mocks/data.json";
import Chat from "./pages/chat";
import Overlay from "./components/overlay";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Message {
  type: string;
  details: WebRequest;
}

export interface IChat {
  me: boolean;
  content: string;
}

function App() {
  const { route } = useRouteContext();
  const [requests, setRequests] = useState<WebRequest[]>([]);
  const [openChat, setOpenChat] = useState(false);
  const [chat, setChat] = useState<IChat[]>([]);
  const [msg, setMsg] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const runned = useRef(false);

  const newMessage = (msg: string) => {
    runned.current = false;
    setOpenChat(true);
    setChat((old) => [
      ...old,
      {
        me: true,
        content: msg.trim(),
      },
    ]);
    setLoadingChat(true);
  };

  useEffect(() => {
    //@ts-ignore
    const browserAPI = chrome.runtime;
    if (browserAPI) {
      browserAPI.onMessage.addListener(function (message: Message) {
        if (message.type === "request") {
          setRequests((old) => [message.details, ...old]);
        }
      });
    } else {
      setRequests(Data as WebRequest[]);
    }
  }, []);

  return (
    <Layout setOpenChat={setOpenChat}>
      {
        {
          table: <Table newMessage={newMessage} requests={requests} />,
          map: <Map />,
        }[route]
      }
      <Overlay
        state={{
          close: () => setOpenChat(false),
          open: openChat,
        }}
        width="800px"
      >
        <Chat
          close={() => setOpenChat(false)}
          chat={chat}
          msg={msg}
          setChat={setChat}
          setMsg={setMsg}
          newMessage={newMessage}
          loadingChat={loadingChat}
          setLoadingChat={setLoadingChat}
          runned={runned}
        />
      </Overlay>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Layout>
  );
}

export default App;
