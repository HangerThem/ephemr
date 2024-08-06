import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

/**
 * Generates a new token using the JWT_SECRET.
 *
 * @param payload - The payload to be encoded in the token.
 * @param expiresIn - The time in which the token will expire.
 * @returns The generated token.
 * @throws Error if JWT_SECRET is not set.
 */
export const generateToken = ({
	payload,
	expiresIn,
}: {
	payload: any
	expiresIn?: string
}) => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not set")
	}
	return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn || "" })
}

/**
 * Verifies the provided refresh token using the JWT_REFRESH_SECRET.
 *
 * @param refreshToken - The refresh token to be verified.
 * @returns The decoded refresh token payload containing the user ID.
 * @throws Error if JWT_REFRESH_SECRET is not set or if the refresh token is invalid.
 */
export const verifyRefreshToken = (refreshToken: string) => {
	if (!JWT_REFRESH_SECRET) {
		throw new Error("JWT_REFRESH_SECRET is not set")
	}
	try {
		const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
		return decoded as { id: string }
	} catch (err) {
		console.error(err)
		throw new Error("Invalid refresh token")
	}
}

/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param token - The JWT to be verified.
 * @param customSecret - An optional custom secret for verification. If not provided, JWT_SECRET is used.
 * @returns The decoded payload of the JWT, containing the `id` property.
 * @throws An error if the secret is not set or if the token is invalid.
 */
export const verifyToken = (token: string, customSecret?: string) => {
	const secret = customSecret || JWT_SECRET
	if (!secret) {
		throw new Error("Secret is not set")
	}
	try {
		const decoded = jwt.verify(token, secret)
		return decoded as { id: string }
	} catch (err) {
		console.error(err)
		throw new Error("Invalid token")
	}
}

/**
 * Generates new JWT tokens.
 * @param id - The user ID.
 * @returns An object containing the generated token and refresh token.
 * @throws Error if JWT_SECRET or JWT_REFRESH_SECRET is not set.
 */
export const generateNewTokens = (id: string) => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not set")
	}
	if (!JWT_REFRESH_SECRET) {
		throw new Error("JWT_REFRESH_SECRET is not set")
	}
	const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "15min" })
	const newRefreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	})
	return { token, newRefreshToken }
}
