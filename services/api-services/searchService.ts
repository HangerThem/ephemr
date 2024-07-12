import { get } from "../requestHelpers"

export const requestSearchPosts = async (
  query: string
): Promise<
  | {
      status: number
      posts: IPostSimple[]
    }
  | IErrorResponse
> => {
  return await get<{
    status: number
    posts: IPostSimple[]
  }>(`/search/posts?q=${query}`)
}

export const requestSearchUsers = async (
  query: string
): Promise<
  | {
      status: number
      users: IUserSimple[]
    }
  | IErrorResponse
> => {
  return await get<{
    status: number
    users: IUserSimple[]
  }>(`/search/users?q=${query}`)
}
