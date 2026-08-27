import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    socket = io(WS_URL, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}
