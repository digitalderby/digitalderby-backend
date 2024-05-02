export const deletedUsers = new Set();
export function markDeletedUser(username) {
    deletedUsers.add(username);
}
