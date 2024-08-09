import { get, patch, patchFormData, requestDelete } from "../requestHelpers"

export const requestMe = async (): Promise<{
	status: number
	user: IUserFull
}> => {
	return await get<{
		status: number
		user: IUserFull
	}>("/me", "force-cache", 600)
}

export const requestUpdateMe = async (
	user: IUserUpdate
): Promise<
	| {
			status: number
			user: IUserUpdate
	  }
	| IErrorResponse
> => {
	return await patch<{
		status: number
		user: IUserFull
	}>("/me", {
		...user,
	})
}

export const requestDeleteMe = async (): Promise<
	| {
			status: number
			message: string
	  }
	| IErrorResponse
> => {
	return await requestDelete<{
		status: number
		message: string
	}>("/me", {})
}

export const requestUpdateUserInformation = async (
	userInformation: IUpdatreUserInformation
): Promise<
	| {
			status: number
			userInfo: IUserInformation
	  }
	| IErrorResponse
> => {
	return await patch<{
		status: number
		userInfo: IUserInformation
	}>("/me/userInformation", {
		...userInformation,
	})
}

export const requestUpdateProfilePic = async (
	profilePic: File
): Promise<
	| {
			status: number
			message: string
	  }
	| IErrorResponse
> => {
	const formData = new FormData()
	formData.append("profilePic", profilePic)

	return await patchFormData<{
		status: number
		message: string
	}>("/me/profilePic", formData)
}

export const requestDeleteProfilePic = async (): Promise<
	| {
			status: number
			message: string
	  }
	| IErrorResponse
> => {
	return await requestDelete<{
		status: number
		message: string
	}>("/me/profilePic", {})
}
