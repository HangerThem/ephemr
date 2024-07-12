import { post, requestDelete } from "@/services/requestHelpers"

export const requestFollowUser = async (
  userId: string
): Promise<
  | {
      status: number
      user: IUserSimple
    }
  | IErrorResponse
> => {
  return await post<{
    status: number
    user: IUserSimple
  }>(`/users/${userId}/follow`, {})
}

export const requestUnfollowUser = async (
  userId: string
): Promise<
  | {
      status: number
      user: IUserSimple
    }
  | IErrorResponse
> => {
  return await requestDelete<{
    status: number
    user: IUserSimple
  }>(`/users/${userId}/follow`, {})
}
