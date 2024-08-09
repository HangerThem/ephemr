import { get } from "../requestHelpers"

export const requestMoods = async (): Promise<
	| {
			moods: IMood[]
			status: number
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				moods: IMood[]
				status: number
		  }
		| IErrorResponse
	>("/appData/moods")
}

export const requestLanguages = async (): Promise<
	| {
			languages: ILanguage[]
			status: number
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				languages: ILanguage[]
				status: number
		  }
		| IErrorResponse
	>("/appData/languages")
}

export const requestThemes = async (): Promise<
	| {
			themes: ITheme[]
			status: number
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				themes: ITheme[]
				status: number
		  }
		| IErrorResponse
	>("/appData/themes")
}
