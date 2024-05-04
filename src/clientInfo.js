"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInfo = void 0;
var ClientInfo = /** @class */ (function () {
    function ClientInfo(socket) {
        this.socket = socket;
        this.username = socket.data.username;
        this.id = socket.data.id;
        this.wallet = socket.data.wallet;
        this.bankruptcies = socket.data.bankruptcies;
    }
    return ClientInfo;
}());
exports.ClientInfo = ClientInfo;
