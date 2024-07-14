import { get, post } from "../requestHelpers"

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

export const requestVerify = async (
  usernameOrEmail: string,
  code: string
): Promise<
  | {
      status: number
      message: string
    }
  | IErrorResponse
> => {
  return await post<
    | {
        status: number
        message: string
      }
    | IErrorResponse
  >("/auth/verify", {
    usernameOrEmail,
    code,
  })
}

export const requestEmail = async (
  username: string
): Promise<
  | {
      status: number
      email: string
    }
  | IErrorResponse
> => {
  return await get<
    | {
        status: number
        email: string
      }
    | IErrorResponse
  >(`/auth/email?username=${username}`)
}
