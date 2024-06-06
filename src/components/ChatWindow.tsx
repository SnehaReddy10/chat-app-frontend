import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';

function ChatWindow() {
  console.log('ChatWindow');
  const socket = useSocket();
  const [latestMessages, setLatestMessages] = useState<any>([]);
  const [replies, setReplies] = useState<any>([]);
  const [targetId, setTargetId] = useState('');

  console.log('targetId', targetId);

  useEffect(() => {
    if (socket) {
      console.log('socket', socket);
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message, 'message');
        if (message.type == 'id') {
          setTargetId(message.id);
          console.log('targetid', targetId);
        } else if (message.type == 'message') {
          console.log(latestMessages, 'latestMessages');
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
      <input
        type="text"
        className="absolute bottom-3 h-9 end-0 mx-4 w-1/2 rounded-sm"
        onBlur={(e) => {
          setReplies((x: any) => [
            ...x,
            { id: uuidv4(), message: e.target.value },
          ]);
          console.log(replies);
          socket.send(
            JSON.stringify({
              message: e.target.value,
              targetId,
            })
          );
        }}
      />
    </div>
  );
}

export default ChatWindow;
