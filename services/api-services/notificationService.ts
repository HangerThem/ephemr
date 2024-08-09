import { get, patch } from "../requestHelpers"

export const requestNotificationPermissions = async (): Promise<
	| {
			status: number
			notifications: INotificationPermissions
	  }
	| IErrorResponse
> => {
	return await get<
		| {
				status: number
				notifications: INotificationPermissions
		  }
		| IErrorResponse
	>("/me/settings/notifications")
}

export const requestUpdateNotificationPermissions = async (
	notifications: IUpdateNotificationPermissions
): Promise<
	| {
			status: number
			notifications: IUpdateNotificationPermissions
	  }
	| IErrorResponse
> => {
	return await patch<
		| {
				status: number
				notifications: IUpdateNotificationPermissions
		  }
		| IErrorResponse
	>("/me/settings/notifications", notifications)
}
