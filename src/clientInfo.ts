import { Socket } from "socket.io"
import { Types } from "mongoose"

export class ClientInfo {
    socket: Socket
    username: string
    id: Types.ObjectId
    wallet: number

    constructor(socket: Socket) {
        this.socket = socket
        this.username = socket.data.username
        this.id = socket.data.id
        this.wallet = socket.data.wallet
    }
}


