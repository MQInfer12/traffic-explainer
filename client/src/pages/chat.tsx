import { ElementRef, MutableRefObject, useEffect, useRef } from "react";
import { IChat } from "../App";
import Button from "../components/button";
import ButtonIcon from "../components/buttonIcon";
import { SetState } from "../interfaces/setState";
import { api_getAIResponse } from "../services/AIResponse";
import { SuspiciousRequestJSON, WebRequest } from "../interfaces/webRequest";
import Message from "../components/message";

interface Props {
  chat: IChat[];
  setChat: SetState<IChat[]>;
  msg: string;
  setMsg: SetState<string>;
  newMessage: (msg: string) => void;
  close: () => void;
  loadingChat: boolean;
  requests: WebRequest[];
  setLoadingChat: SetState<boolean>;
  runned: MutableRefObject<boolean>;
  setSuspiciousRequests: SetState<SuspiciousRequestJSON>;
}

const Chat = ({
  chat,
  msg,
  setChat,
  setMsg,
  close,
  newMessage,
  loadingChat,
  setLoadingChat,
  runned,
  requests,
  setSuspiciousRequests,
}: Props) => {
  const chatRef = useRef<ElementRef<"div">>(null);

  const handleSend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (msg.trim() === "") return;
    newMessage(msg);
    setMsg("");
  };

  useEffect(() => {
    const getResponse = async () => {
      await api_getAIResponse(chat, requests, (res) => {
        setChat((old) => {
          const lastIndex = old.length - 1;
          const lastMessage = old[lastIndex];
          if (lastMessage.me) {
            return [
              ...old,
              {
                me: false,
                content: res,
              },
            ];
          } else {
            return old.map((v, i) => {
              if (i === lastIndex) {
                return { ...v, content: v.content + res };
              }
              return v;
            });
          }
        });
      });
      setLoadingChat(false);
    };

    const tryJSONParse = (str: string) => {
      try {
        const parsed = JSON.parse(str);
        return parsed;
      } catch (e) {
        return null;
      }
    };

    const isSuspiciousRequestJSON = (
      json: any
    ): json is SuspiciousRequestJSON => {
      return Object.keys(json).every((key) => !isNaN(Number(key)));
    };

    const checkSuspiciousRequests = () => {
      if (chat.length === 0) return;
      const fullRes = chat[chat.length - 1].content;
      if (fullRes.includes("```json")) {
        const json = fullRes.split("```json")[1].split("```")[0];
        const parsed = tryJSONParse(json);
        if (!parsed) return;
        if (isSuspiciousRequestJSON(parsed)) {
          setSuspiciousRequests(parsed);
        }
      }
    };

    if (loadingChat && !runned.current) {
      runned.current = true;
      getResponse();
    } else {
      checkSuspiciousRequests();
    }
  }, [loadingChat]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [chat]);

  return (
    <div className="h-full p-5">
      <div className="border border-amber-900/20 rounded-lg h-full flex flex-col justify-between p-2 gap-2">
        <div className="flex justify-between">
          <ButtonIcon onClick={close} icon="x" />
          <div className="flex">
            <ButtonIcon
              onClick={() => setChat([])}
              icon="trash"
              type="secondary"
            />
          </div>
        </div>
        <div
          ref={chatRef}
          className="w-full flex flex-col gap-2 flex-1 overflow-y-scroll overflow-x-hidden px-2"
        >
          {chat.map((message, i) => (
            <Message key={i} message={message} newMessage={newMessage} />
          ))}
        </div>
        <form className="w-full flex gap-2">
          <input
            autoFocus
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="border border-amber-900/40 w-full rounded-lg outline-amber-900/40 p-2 text-sm font-bold text-black/60 disabled:bg-gray-100"
          />
          <Button disabled={loadingChat} onClick={handleSend}>
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
