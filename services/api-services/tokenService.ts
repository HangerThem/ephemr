import { getWithToken } from "../requestHelpers"

export const requestTokens = async (
	refreshToken: string
): Promise<
	| {
		status: number
		token: string
		refreshToken: string
	}
	| IErrorResponse
> => {
	return await getWithToken<
	| {
		status: number
		token: string
		refreshToken: string
		}
	| IErrorResponse
	>("/refresh", refreshToken, "no-store")
}
