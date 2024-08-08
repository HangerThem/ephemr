"use client"

import { downloadDataService } from "@/services/api-services/downloadDataService"
import {
	FormField,
	FormInput,
	FormLabel as PrestyledFormLabel,
	FormArea,
} from "@/components/forms/formStyles"
import {
	requestUpdateMe,
	requestUpdateProfilePic,
	requestDeleteProfilePic,
} from "@/services/api-services/meService"
import styled from "styled-components"
import { useAuth } from "@/context/authContext"
import { useState } from "react"

const FormLabel = styled(PrestyledFormLabel)`
	background-color: rgb(var(--background));
`

export default function Page() {
	const { user, getUser } = useAuth()
	const [image, setImage] = useState<File | null>(null)

	const handleDownload = async () => {
		try {
			const response = await downloadDataService()
			const url = window.URL.createObjectURL(
				new Blob([JSON.stringify(response, null, 2)])
			)
			const a = document.createElement("a")
			a.href = url
			a.download = "user_data.json"
			a.click()
		} catch (e) {
			console.error("Error downloading data: ", e)
		}
	}

	const handleUpdate = async (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target

		try {
			await requestUpdateMe({ [name]: value })
			getUser()
		} catch (e) {
			console.error("Error updating user: ", e)
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setImage(file)
		}
	}

	const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!image) {
			console.error("No image selected")
			return
		}

		try {
			await requestUpdateProfilePic(image)
			getUser()
		} catch (e) {
			console.error("Error uploading profile picture: ", e)
		}
	}

	const handleImageDelete = async () => {
		try {
			await requestDeleteProfilePic()
			getUser()
		} catch (e) {
			console.error("Error deleting profile picture: ", e)
		}
	}

	return (
		<div>
			<section>
				<h1>Profile Information</h1>
				<FormField>
					<FormInput
						type="text"
						defaultValue={user?.displayName}
						name="displayName"
						onBlur={handleUpdate}
					/>
					<FormLabel>Display Name</FormLabel>
				</FormField>
				<FormField>
					<FormInput
						type="email"
						defaultValue={user?.email}
						name="email"
						onBlur={handleUpdate}
					/>
					<FormLabel>Email</FormLabel>
				</FormField>

				<form onSubmit={handleImageUpload}>
					<FormField>
						<FormInput
							type="file"
							accept="image/*"
							name="profilePic"
							onChange={handleImageChange}
						/>
						<FormLabel>Profile Picture</FormLabel>
					</FormField>
					<button type="submit">Upload</button>
				</form>

				<button onClick={handleImageDelete}>Delete Profile Picture</button>
			</section>
		</div>
	)
}
