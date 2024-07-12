import { useAuth } from "@/context/authContext"
import {
  Form,
  FormTitle,
  FormClose,
  FormField,
  FormLabel,
  FormInput,
  FormPasswordShow,
  Eye,
  EyeSlash,
  FormText,
  FormLink,
  ErrorMessage,
} from "@/components/forms/formStyles"
import Button from "@/components/buttons/button"
import { useState } from "react"

interface LoginFormProps {
  toggleLogin: () => void
}

export default function LoginForm({ toggleLogin }: LoginFormProps) {
  const { login, toggleModal } = useAuth()
  const [errors, setErrors] = useState<LoginResponse>()
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      emailOrUsername: { value: string }
      password: { value: string }
    }
    const emailOrUsername = target.emailOrUsername.value
    const password = target.password.value
    const response = await login(emailOrUsername, password)
    if (
      response.invalidUsernameOrEmail ||
      response.userNotFound ||
      response.incorrectPassword
    ) {
      setErrors(response)
      return
    }

    target.emailOrUsername.value = ""
    target.password.value = ""
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormClose onClick={toggleModal} />
      <FormTitle>Login</FormTitle>
      <FormField
        className={
          errors?.invalidUsernameOrEmail || errors?.userNotFound ? "error" : ""
        }
      >
        <FormInput
          type="text"
          id="emailOrUsername"
          required
          onChange={() =>
            setErrors({
              ...errors,
              invalidUsernameOrEmail: false,
              userNotFound: false,
            } as LoginResponse)
          }
        />
        <FormLabel htmlFor="emailOrUsername">Email or Username</FormLabel>
        {errors?.invalidUsernameOrEmail && (
          <ErrorMessage className="error">
            Invalid username or email
          </ErrorMessage>
        )}
        {errors?.userNotFound && (
          <ErrorMessage className="error">User not found</ErrorMessage>
        )}
      </FormField>
      <FormField className={errors?.incorrectPassword ? "error" : ""}>
        <FormInput
          id="password"
          required
          type={showPassword ? "text" : "password"}
          className="password"
          onChange={() =>
            setErrors({ ...errors, incorrectPassword: false } as LoginResponse)
          }
        />
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormPasswordShow onClick={togglePassword}>
          {showPassword ? <EyeSlash /> : <Eye />}
        </FormPasswordShow>
        {errors?.incorrectPassword && (
          <ErrorMessage className="error">Incorrect password</ErrorMessage>
        )}
      </FormField>
      <Button type="submit" size="full">
        Login
      </Button>
      <FormText>
        Don&apos;t have an account?{" "}
        <FormLink onClick={toggleLogin}>Register</FormLink>
      </FormText>
    </Form>
  )
}
