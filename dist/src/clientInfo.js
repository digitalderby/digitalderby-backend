export class ClientInfo {
    socket;
    username;
    id;
    wallet;
    constructor(socket) {
        this.socket = socket;
        this.username = socket.data.username;
        this.id = socket.data.id;
        this.wallet = socket.data.wallet;
    }
}
