"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/context/toastContext"
import { emailRegex } from "@/constants/emailRegex"
import { requestMe } from "@/services/api-services/meService"
import { useSocketContext } from "./socketContext"
import {
  requestLogin,
  requestRegister,
} from "@/services/api-services/authService"
import { isError } from "@/utils/isError"
import { useRouter } from "next/navigation"
import { requestTokens } from "@/services/api-services/tokenService"

interface AuthContextProps {
  loading: boolean
  token: string | undefined
  refreshToken: string | undefined
  user: IUserFull | null
  modalOpen: boolean
  getUser: () => void
  login: (usernameOrEmail: string, password: string) => Promise<LoginResponse>
  register: (
    email: string,
    username: string,
    displayName: string,
    password: string,
    passwordConfirm: string
  ) => Promise<RegisterResponse>
  logout: () => void
  refreshTokens: () => Promise<void>
  toggleModal: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
}

let tokenRefreshTimeout: NodeJS.Timeout | null = null
const expiresIn = 15 * 60

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

/**
 * Provides authentication and user management functionality for the application.
 * @component
 * @param {AuthProviderProps} props - The props for the component.
 * @returns {React.ReactElement}
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>()
  const [refreshToken, setRefreshToken] = useState<string | undefined>()
  const [user, setUser] = useState<IUserFull | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { addToastNotification } = useToast()
  const { disconnect, connect } = useSocketContext()
  const router = useRouter()

  useEffect(() => {
    try {
      const token = localStorage.getItem("ephemrToken")
      const refreshToken = localStorage.getItem("ephemrRefreshToken")
      if (token && refreshToken) {
        setTokens(token, refreshToken)
      } else {
        if (!localStorage.getItem("empherVisitedBefore")) {
          localStorage.setItem("empherVisitedBefore", "true")
          setModalOpen(true)
        }
        setLoading(false)
      }
    } catch (error) {
      console.error("Error accessing localStorage", error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      setLoading(true)
      getUser()
    }
  }, [token])

  /**
   * Logs in the user with the provided username and password.
   * @param {string} usernameOrEmail - The username or email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<LoginResponse>} A promise that resolves to the login response.
   */
  const login = async (
    usernameOrEmail: string,
    password: string
  ): Promise<LoginResponse> => {
    let response: LoginResponse = {
      userNotFound: false,
      invalidUsernameOrEmail: false,
      incorrectPassword: false,
    }
    if (!usernameOrEmail || !password) {
      response.invalidUsernameOrEmail = true
      return response
    }
    await requestLogin({ usernameOrEmail, password })
      .then(async (res) => {
        if (isError(res)) {
          if (res.status === 401) {
            response.incorrectPassword = true
            throw new Error("Unauthorized")
          }
          if (res.status === 403) {
            router.push("/register/verify")
            sessionStorage.setItem("ephemrUsernameOrEmail", usernameOrEmail)
            throw new Error("User not verified")
          }
          if (res.status === 404) {
            response.userNotFound = true
            throw new Error("User not found")
          }
          if (res.status === 500) {
            addToastNotification({
              type: "error",
              title: "Server error",
              description: "Please try again later",
            })
            throw new Error("Server error")
          }
          return response
        }

        const { token, refreshToken } = res
        setTokens(token, refreshToken)
        await getUser()
        setModalOpen(false)
        addToastNotification({
          type: "success",
          title: "Welcome back!",
          description: "You have successfully logged in",
        })
      })
      .catch((err) => {
        console.error(err)
      })
    return response
  }

  /**
   * Logs out the user by clearing the token and refresh token from state
   * and removing them from local storage.
   * @returns {void}
   */
  const logout = (): void => {
    setToken(undefined)
    setRefreshToken(undefined)
    localStorage.removeItem("ephemrToken")
    localStorage.removeItem("ephemrRefreshToken")
    setUser(null)
    disconnect()
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
      tokenRefreshTimeout = null
    }
  }

  /**
   * Fetches the user data from the API and updates the state with the response.
   * Displays a toast notification upon successful login.
   * @returns {Promise<void>}
   */
  const getUser = async (): Promise<void> => {
    if (!token) {
      return
    }
    tokenRefreshTimeout = setTimeout(() => {
      refreshTokens()
    }, expiresIn * 1000 - 10000)
    await requestMe()
      .then(async (res) => {
        if (res.status === 401) {
          await refreshTokens()
          return
        }
        if (res.status === 400) {
          throw new Error("Invalid token")
        }
        if (res.status === 404) {
          throw new Error("User not found")
        }
        setUser(res.user)
      })
      .catch((err) => {
        console.error(err)
      })
    setLoading(false)
  }

  /**
   * Registers a new user.
   * @param {string} email - The email of the user.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @param {string} passwordConfirm - The confirmation password of the user.
   * @returns {Promise<RegisterResponse>} A promise that resolves to a RegisterResponse object.
   */
  const register = async (
    email: string,
    username: string,
    displayName: string,
    password: string,
    passwordConfirm: string
  ): Promise<RegisterResponse> => {
    let response: RegisterResponse = {
      userAlreadyExists: false,
      emailInUse: false,
      invalidEmail: false,
      passwordMismatch: false,
    }
    if (!emailRegex.test(email)) {
      console.log(email)
      console.log("Invalid email")
      response.invalidEmail = true
    }
    if (password !== passwordConfirm) {
      response.passwordMismatch = true
    }
    if (response.invalidEmail || response.passwordMismatch) {
      return response
    }
    await requestRegister({
      email,
      username,
      displayName,
      password,
      passwordConfirm,
    })
      .then(async (res) => {
        if (isError(res)) {
          if (res.status === 400) {
            throw new Error("Invalid request")
          }
          if (res.status === 401) {
            response.passwordMismatch = true
            throw new Error("Password mismatch")
          }
          if (res.status === 409) {
            res.error === "Username already in use"
              ? (response.userAlreadyExists = true)
              : (response.emailInUse = true)
            throw new Error("User already exists")
          }
          if (res.status === 500) {
            addToastNotification({
              type: "error",
              title: "Server error",
              description: "Please try again later",
            })
            throw new Error("Server error")
          }

          return response
        }

        const { token, refreshToken } = res
        setTokens(token, refreshToken)
        await getUser()
        setModalOpen(false)
        addToastNotification({
          type: "success",
          title: "Welcome!",
          description: "You have successfully registered and logged in",
        })
      })
      .catch((err) => {
        console.error(err)
      })
    return response
  }

  /**
   * Refreshes the access token using the refresh token.
   * If the refresh token is not available, the function returns early.
   * If the response status is 400, an error is thrown indicating an invalid refresh token.
   * If the response is successful, the tokens are updated in the state and stored in the local storage.
   * If there is an error, the user is logged out.
   * @returns {Promise<void>}
   */
  const refreshTokens = async (): Promise<void> => {
    if (!refreshToken) {
      return
    }
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
      tokenRefreshTimeout = null
    }
    await requestTokens(refreshToken)
      .then(async (res) => {
        if (isError(res)) {
          if (res.status === 400) {
            throw new Error("Invalid refresh token")
          }

          return
        }

        const { token, refreshToken } = res
        setTokens(token, refreshToken)
      })
      .catch((err) => {
        console.error(err)
        logout()
      })
  }

  /**
   * Toggles the modal open state.
   * @returns {void}
   */
  const toggleModal = (): void => {
    setModalOpen(!modalOpen)
  }

  /**
   * Sets the tokens in the state and local storage.
   * If a token refresh timeout is set, it is cleared and a new timeout is set.
   * @param {string} token - The access token.
   * @param {string} refreshToken - The refresh token.
   * @returns {void}
   */
  const setTokens = (token: string, refreshToken: string): void => {
    setToken(token)
    setRefreshToken(refreshToken)
    localStorage.setItem("ephemrToken", token)
    localStorage.setItem("ephemrRefreshToken", refreshToken)

    connect()

    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
    }

    tokenRefreshTimeout = setTimeout(() => {
      refreshTokens()
    }, expiresIn * 1000 - 10000)
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        token,
        refreshToken,
        user,
        modalOpen,
        getUser,
        login,
        register,
        logout,
        refreshTokens,
        toggleModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to consume the AuthContext.
 * @returns {AuthContextProps} The context value.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider")
  }
  return context
}
