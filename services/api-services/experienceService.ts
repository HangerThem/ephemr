import { get, patch } from "../requestHelpers"

export const requestExperience = async (): Promise<
	| {
			experience: IExperience
			status: number
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				experience: IExperience
				status: number
		  }
		| IErrorResponse
	>("/me/experience")
}

export const requestUpdateExperience = async (
	experience: IUpdateExperience
): Promise<
	| {
			experience: IUpdateExperience
			status: number
	  }
	| IErrorResponse
> => {
	return await patch<
		| {
				experience: IUpdateExperience
				status: number
		  }
		| IErrorResponse
	>("/me/experience", experience)
}
