"use client"

import { useAuth } from "@/context/authContext"
import {
	Form,
	FormClose,
	FormTitle,
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

export default function RegisterForm() {
	const { register } = useAuth()
	const [errors, setErrors] = useState<RegisterResponse>()
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)

	const togglePassword = () => {
		setShowPassword(!showPassword)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		const target = e.target as typeof e.target & {
			email: { value: string }
			username: { value: string }
			displayName: { value: string }
			password: { value: string }
			passwordConfirm: { value: string }
		}
		const email = target.email.value
		const username = target.username.value
		const displayName = target.displayName.value
		const password = target.password.value
		const passwordConfirm = target.passwordConfirm.value

		const response = await register(
			email,
			username,
			displayName,
			password,
			passwordConfirm
		)
		setLoading(false)

		if (
			response.emailInUse ||
			response.invalidEmail ||
			response.userAlreadyExists ||
			response.passwordMismatch
		) {
			setErrors(response)
			return
		}

		target.email.value = ""
		target.username.value = ""
		target.displayName.value = ""
		target.password.value = ""
		target.passwordConfirm.value = ""
	}

	return (
		<Form onSubmit={handleSubmit}>
			<FormTitle>Register</FormTitle>
			<FormField
				className={errors?.emailInUse || errors?.invalidEmail ? "error" : ""}
			>
				<FormInput
					type="email"
					id="email"
					required
					onChange={() =>
						setErrors({
							...errors,
							emailInUse: false,
							invalidEmail: false,
						} as RegisterResponse)
					}
				/>
				<FormLabel htmlFor="email">Email</FormLabel>
				{errors?.emailInUse && (
					<ErrorMessage className="error">Email is already in use</ErrorMessage>
				)}
				{errors?.invalidEmail && (
					<ErrorMessage className="error">Email is invalid</ErrorMessage>
				)}
			</FormField>
			<FormField className={errors?.userAlreadyExists ? "error" : ""}>
				<FormInput
					type="text"
					id="username"
					required
					onChange={() =>
						setErrors({
							...errors,
							userAlreadyExists: false,
						} as RegisterResponse)
					}
				/>
				<FormLabel htmlFor="username">Username</FormLabel>
				{errors?.userAlreadyExists && (
					<ErrorMessage className="error">
						Username is already in use
					</ErrorMessage>
				)}
			</FormField>
			<FormField>
				<FormInput type="text" id="displayName" required />
				<FormLabel htmlFor="displayName">Display Name</FormLabel>
			</FormField>
			<FormField className={errors?.passwordMismatch ? "error" : ""}>
				<FormInput
					type={showPassword ? "text" : "password"}
					id="password"
					required
					onChange={() =>
						setErrors({
							...errors,
							passwordMismatch: false,
						} as RegisterResponse)
					}
					className="password"
				/>
				<FormLabel htmlFor="password">Password</FormLabel>
				<FormPasswordShow onClick={togglePassword}>
					{showPassword ? <EyeSlash /> : <Eye />}
				</FormPasswordShow>
				{errors?.passwordMismatch && (
					<ErrorMessage className="error">Passwords do not match</ErrorMessage>
				)}
			</FormField>
			<FormField className={errors?.passwordMismatch ? "error" : ""}>
				<FormInput
					type={showPassword ? "text" : "password"}
					id="passwordConfirm"
					required
					onChange={() => setErrors(undefined)}
				/>
				<FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
			</FormField>
			<Button type="submit" size="full" loading={loading}>
				Register
			</Button>
			<FormText>
				Already have an account? <FormLink href="/login">Login</FormLink>
			</FormText>
		</Form>
	)
}
