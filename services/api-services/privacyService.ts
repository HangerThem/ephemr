import { get, patch } from "../requestHelpers"

export const requestPrivacy = async (): Promise<
	| {
			status: number
			privacy: IPrivacy
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				status: number
				privacy: IPrivacy
		  }
		| IErrorResponse
	>("/me/privacy")
}

export const requestUpdatePrivacy = async (
	privacy: IUpdatePrivacy
): Promise<
	| {
			status: number
			privacy: IUpdatePrivacy
	  }
	| IErrorResponse
> => {
	return await patch<
		| {
				status: number
				privacy: IUpdatePrivacy
		  }
		| IErrorResponse
	>("/me/privacy", privacy)
}
