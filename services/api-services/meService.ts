import { get, patch } from "../requestHelpers"

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
