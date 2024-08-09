"use client"

import {
	FormField,
	FormInput,
	FormFieldDouble,
	FormPasswordShow,
	Eye,
	EyeSlash,
	ErrorMessage,
	FormLabel,
	FormSuccess,
} from "@/components/forms/formStyles"
import {
	requestUpdateEmail,
	requestUpdatePassword,
} from "@/services/api-services/authService"
import { useAuth } from "@/context/authContext"
import Button from "@/components/buttons/button"
import { useEffect, useState } from "react"
import {
	Section,
	SectionsContainer,
} from "@/components/settings/settingsStyles"
import { emailRegex } from "@/constants/emailRegex"
import { isError } from "@/utils/isError"

export default function Page() {
	const [showPassword, setShowPassword] = useState(false)
	const [passwordChanged, setPasswordChanged] = useState(false)
	const [emailChanged, setEmailChanged] = useState(false)
	const [passwordErrors, setPasswordErrors] = useState({
		password: "",
		confirmPassword: "",
	})
	const [emailErrors, setEmailErrors] = useState({
		email: "",
	})
	const [passwordLoading, setPasswordLoading] = useState(false)
	const [emailLoading, setEmailLoading] = useState(false)
	const [passwordSuccess, setPasswordSuccess] = useState(false)
	const [emailSuccess, setEmailSuccess] = useState(false)
	const [password, setPassword] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	})
	const [email, setEmail] = useState("")
	const { user, getUser } = useAuth()

	const checkEmailValidity = () => {
		if (!emailRegex.test(email)) {
			setEmailErrors({
				...emailErrors,
				email: "Invalid email",
			})
			setEmailChanged(false)
		} else {
			setEmailErrors({
				...emailErrors,
				email: "",
			})
			setEmailChanged(true)
		}
	}

	const handleEmailUpdate = async () => {
		setEmailLoading(true)
		const response = await requestUpdateEmail(email)
		if (isError(response)) {
			setEmailErrors({
				...emailErrors,
				email: response.error,
			})
			return
		}

		getUser()
		setEmailSuccess(true)
		setEmailLoading(false)
	}

	const handlePasswordUpdate = async () => {
		setPasswordLoading(true)
		const response = await requestUpdatePassword(password)
		if (isError(response)) {
			setPasswordErrors({
				...passwordErrors,
				password: response.error,
			})
			setPasswordLoading(false)
			return
		}

		setPasswordSuccess(true)
		setPasswordLoading(false)
	}

	useEffect(() => {
		if (password.newPassword.length >= 6 && password.currentPassword) {
			if (password.newPassword !== password.confirmPassword) {
				setPasswordErrors({
					...passwordErrors,
					confirmPassword: "Passwords do not match",
				})
				setPasswordChanged(false)
			} else {
				setPasswordErrors({
					...passwordErrors,
					confirmPassword: "",
				})
				setPasswordChanged(true)
			}
		} else {
			setPasswordChanged(false)
		}
	}, [password])

	const togglePassword = () => {
		setShowPassword(!showPassword)
	}

	return (
		<SectionsContainer>
			<h2>Security</h2>
			<Section>
				<p>Password</p>
				{passwordSuccess && (
					<FormSuccess onClick={() => setPasswordSuccess(false)}>
						Password updated
					</FormSuccess>
				)}
				<FormField>
					<FormInput
						type={showPassword ? "text" : "password"}
						onChange={(e) => {
							setPassword({
								...password,
								currentPassword: e.target.value,
							})
						}}
						name="currentPassword"
						className="password"
					/>
					<FormLabel className="bg-transparent">Current Password</FormLabel>
					<FormPasswordShow onClick={togglePassword}>
						{showPassword ? <EyeSlash /> : <Eye />}
					</FormPasswordShow>
				</FormField>
				<FormFieldDouble>
					<FormField className={passwordErrors.password ? "error" : ""}>
						<FormInput
							type={showPassword ? "text" : "password"}
							onChange={(e) => {
								setPasswordErrors({
									...passwordErrors,
									password: "",
								})
								setPassword({
									...password,
									newPassword: e.target.value,
								})
							}}
							name="password"
						/>
						<FormLabel className="bg-transparent">New Password</FormLabel>
						{passwordErrors.password && (
							<ErrorMessage>{passwordErrors.password}</ErrorMessage>
						)}
					</FormField>
					<FormField className={passwordErrors.confirmPassword ? "error" : ""}>
						<FormInput
							type={showPassword ? "text" : "password"}
							onChange={(e) => {
								setPassword({
									...password,
									confirmPassword: e.target.value,
								})
							}}
							name="confirmPassword"
						/>
						<FormLabel className="bg-transparent">
							Confirm New Password
						</FormLabel>
						{passwordErrors.confirmPassword && (
							<ErrorMessage>{passwordErrors.confirmPassword}</ErrorMessage>
						)}
					</FormField>
				</FormFieldDouble>
				<Button
					disabled={!passwordChanged || passwordErrors.password.length > 0}
					loading={passwordLoading}
					onClick={handlePasswordUpdate}
				>
					Save
				</Button>
			</Section>
			<Section>
				<p>Email</p>
				{emailSuccess && (
					<FormSuccess onClick={() => setEmailSuccess(false)}>
						Email updated
					</FormSuccess>
				)}
				<FormField className={emailErrors.email ? "error" : ""}>
					<FormInput
						type="email"
						name="email"
						defaultValue={user?.email}
						onChange={(e) => {
							setEmailErrors({
								email: "",
							})
							setEmail(e.target.value)
						}}
						onBlur={() => {
							checkEmailValidity()
							if (email !== user?.email) {
								setEmailChanged(true)
							} else {
								setEmailChanged(false)
							}
						}}
					/>
					<FormLabel className="bg-transparent">Email</FormLabel>
					{emailErrors.email && (
						<ErrorMessage>{emailErrors.email}</ErrorMessage>
					)}
				</FormField>
				<Button
					onClick={handleEmailUpdate}
					disabled={!emailChanged || emailErrors.email.length > 0}
					loading={emailLoading}
				>
					Save
				</Button>
			</Section>
		</SectionsContainer>
	)
}
