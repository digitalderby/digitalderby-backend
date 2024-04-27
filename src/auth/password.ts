import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function saltPassword(password: string): Promise<string> {
    if (password.length === 0) {
        throw new Error('Password must be a nonempty string')
    }

    return await bcrypt.hash(password, await bcrypt.genSalt(SALT_ROUNDS))
}

export async function verifyPassword(target: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(target, hash)
}
