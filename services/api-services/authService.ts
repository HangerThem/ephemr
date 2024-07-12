import { post } from "../requestHelpers"

export const requestLogin = async (
  user: ILoginUser
): Promise<
  | {
      status: number
      token: string
      refreshToken: string
    }
  | IErrorResponse
> => {
  return await post<
    | {
        status: number
        token: string
        refreshToken: string
      }
    | IErrorResponse
  >("/auth/login", {
    ...user,
  })
}

export const requestRegister = async (
  user: IRegisterUser
): Promise<
  | {
      status: number
      token: string
      refreshToken: string
    }
  | IErrorResponse
> => {
  return await post<
    | {
        status: number
        token: string
        refreshToken: string
      }
    | IErrorResponse
  >("/auth/register", {
    ...user,
  })
}