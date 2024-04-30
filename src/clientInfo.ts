import { Socket } from "socket.io"

export type ClientInfo = {
    socket: Socket,
    username: string,
}
