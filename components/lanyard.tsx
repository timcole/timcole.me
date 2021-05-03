import { FC, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Presence } from '../types/lanyard';

enum Operation {
  Event,
  Hello,
  Initialize,
  Heartbeat,
}

enum EventType {
  INIT_STATE = 'INIT_STATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
}

type SocketEvent = {
  op: Operation;
  t?: EventType;
  d: Presence | unknown;
};

export const LanyardContext = createContext<Presence | null>(null);
export const useLanyard = () => useContext(LanyardContext);

const LanyardProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [doing, setDoing] = useState<Presence>();

  const send = (op: Operation, d?: unknown): void => {
    if (socket !== null) socket.send(JSON.stringify({ op, d }));
  };

  useEffect(() => {
    if (socket === null) return () => {};
    socket.onmessage = function ({ data }: MessageEvent): void {
      const { op, t, d }: SocketEvent = JSON.parse(data);

      if (op === Operation.Hello) {
        setInterval(() => send(Operation.Heartbeat), (d as { heartbeat_interval: number }).heartbeat_interval);
        send(Operation.Initialize, { subscribe_to_id: '83281345949728768' });
      } else if (op === Operation.Event)
        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t)) setDoing(d as Presence);
    };
  }, [socket]);

  useEffect(() => {
    if (socket !== null) return () => {};
    setSocket(new WebSocket('wss://api.lanyard.rest/socket'));
  }, []);

  return <LanyardContext.Provider value={{ ...doing }}>{children}</LanyardContext.Provider>;
};

export default LanyardProvider;
