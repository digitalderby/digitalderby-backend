"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markDeletedUser = exports.deletedUsers = void 0;
exports.deletedUsers = new Set();
function markDeletedUser(username) {
    exports.deletedUsers.add(username);
}
exports.markDeletedUser = markDeletedUser;
