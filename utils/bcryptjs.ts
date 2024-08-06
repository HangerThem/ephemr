import { compare, hash } from "bcryptjs"

/**
 * Hashes a password using bcrypt.
 * @param password - The password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string) => {
	return await hash(password, 12)
}

/**
 * Verifies if a password matches a hashed password.
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the password matches the hashed password.
 */
export const verifyPassword = async (
	password: string,
	hashedPassword: string
) => {
	return await compare(password, hashedPassword)
}
