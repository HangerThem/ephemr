"use client"

import {
	FormField,
	FormInput,
	FormLabel as PrestyledLabel,
} from "@/components/forms/formStyles"
import styled from "styled-components"
import { useAuth } from "@/context/authContext"

const FormLabel = styled(PrestyledLabel)`
	background-color: rgb(var(--background));
`

export default function Page() {
	const { user } = useAuth()

	return (
		<section>
			<h2>Security</h2>
			<p>Update your security information</p>
			<FormField>
				<FormInput type="password" name="password" />
				<FormLabel>Password</FormLabel>
			</FormField>
			<FormField>
				<FormInput type="password" name="confirmPassword" />
				<FormLabel>Confirm Password</FormLabel>
			</FormField>
		</section>
	)
}
