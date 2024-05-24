import { ElementRef, MutableRefObject, useEffect, useRef } from "react";
import { IChat } from "../App";
import Button from "../components/button";
import ButtonIcon from "../components/buttonIcon";
import { SetState } from "../interfaces/setState";
import { twClass } from "../utils/twClass";
import { AIResponse } from "../utils/AIResponse";

interface Props {
  chat: IChat[];
  setChat: SetState<IChat[]>;
  msg: string;
  setMsg: SetState<string>;
  newMessage: (msg: string) => void;
  close: () => void;
  loadingChat: boolean;
  setLoadingChat: SetState<boolean>;
  runned: MutableRefObject<boolean>;
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
      await AIResponse(chat, (res) => {
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
    if (loadingChat && !runned.current) {
      runned.current = true;
      getResponse();
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
            <div
              key={i}
              className={twClass(
                "w-[600px] max-w-full flex",
                message.me ? "self-end justify-end" : "self-start justify-start"
              )}
            >
              <p
                className={twClass(
                  "font-bold text-black/60 p-2 px-4 text-sm rounded-b-lg leading-relaxed w-fit animate-[appear_.3s] whitespace-pre-line",
                  message.me
                    ? "bg-amber-900/30 rounded-tl-lg text-end"
                    : "bg-amber-900/10 rounded-tr-lg text-start"
                )}
              >
                {message.content}
              </p>
            </div>
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
