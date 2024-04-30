import { Socket } from "socket.io"
import User from "./models/User.js"

export class ClientInfo {
    socket: Socket
    username: string
    id: string
    wallet: number

    constructor(socket: Socket) {
        this.socket = socket
        this.username = socket.data.username
        this.id = socket.data.id
        this.wallet = socket.data.number
    }
}


