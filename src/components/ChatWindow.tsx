import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';

function ChatWindow() {
  const socket = useSocket();
  const [latestMessages, setLatestMessages] = useState<any>([]);
  const [replies, setReplies] = useState<any>([]);
  const [targetId, setTargetId] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type == 'id') {
          setTargetId(message.id);
        } else if (message.type == 'message') {
          setLatestMessages((x: any) => [...x, message.message]);
        }
      };
    }
  }, [socket]);

  if (!socket) {
    return <div>Connecting to the server</div>;
  }
  return (
    <div className="relative p-2 m-1 rpunded-sm h-screen bg-slate-300 border border-slate-400">
      {latestMessages.length > 0 &&
        latestMessages.map((x: string, i: number) => (
          <div
            key={i}
            className="absolute p-2 start-1 border border-slate-400 bg-slate-200"
            style={{ marginTop: `${i * 3}rem` }}
          >
            <p className="text-xs font-sans">{x}</p>
          </div>
        ))}
      <div className="p-6">
        {replies.length > 0 &&
          replies.map((x: any, i: number) => (
            <div
              key={x.id}
              className="absolute p-2 end-1 border border-slate-400 bg-slate-200"
              style={{ marginTop: `${i * 3}rem` }}
            >
              <p className="text-xs font-sans">{x.message}</p>
            </div>
          ))}
      </div>
      <div className="flex absolute bottom-3 h-12 end-8 items-center">
        <input
          type="text"
          className="px-6 py-1 mx-4 rounded-full"
          onBlur={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setReplies((x: any) => [
              ...x,
              { id: uuidv4(), message: currentMessage },
            ]);
            console.log(replies);
            socket.send(
              JSON.stringify({
                message: currentMessage,
                targetId,
              })
            );
          }}
          className="bg-slate-800 hover:bg-slate-700 px-6 py-1 text-white uppercase text-[0.55rem] font-bold rounded-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
