export const deletedUsers = new Set()

export function markDeletedUser(username: string) {
    deletedUsers.add(username)
}
