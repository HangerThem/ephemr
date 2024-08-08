"use client"

import { downloadDataService } from "@/services/api-services/downloadDataService"
import {
	FormArea,
	FormField,
	FormInput,
	FormLabel as PrestyledFormLabel,
} from "@/components/forms/formStyles"
import {
	requestUpdateMe,
	requestUpdateProfilePic,
	requestDeleteProfilePic,
	requestUpdateUserInformation,
} from "@/services/api-services/meService"
import styled from "styled-components"
import { useAuth } from "@/context/authContext"
import { useState } from "react"
import Link from "next/link"

const SettingsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: relative;
	width: 100%;
	padding-inline: 5rem;
	scrollbar-width: none;
	gap: 5rem;
	height: calc(100vh - 5.5rem);
	overflow: auto;
`

const SettingsNav = styled.nav`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding-top: 5rem;
	align-items: flex-end;
	position: sticky;
	gap: 1rem;
	flex: 1;
	height: calc(100vh - 5.5rem);
	overflow: auto;

	a {
		font-size: 1.25rem;
		text-decoration: none;
		color: rgba(var(--light), 0.75);

		&:hover {
			color: rgba(var(--light), 1);
		}
	}
`

const SettingsActions = styled.div`
	flex: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
`

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

	const handleUpdateUserInformation = async (
		e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		const { name, value } = e.target

		try {
			await requestUpdateUserInformation({ [name]: value })
			getUser()
		} catch (e) {
			console.error("Error updating user information: ", e)
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
		<SettingsWrapper>
			<SettingsNav>
				<Link href="#profile" passHref>
					Profile
				</Link>
				<Link href="#security" passHref>
					Security
				</Link>
				<Link href="#notifications" passHref>
					Notifications
				</Link>
				<Link href="#data" passHref>
					Data
				</Link>
			</SettingsNav>
			<SettingsActions>
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
					<FormArea
						defaultValue={user?.userInformation.bio}
						name="bio"
						onBlur={handleUpdateUserInformation}
					/>
					<FormLabel>Bio</FormLabel>
				</FormField>
				<FormField>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.location}
						name="location"
						onBlur={handleUpdateUserInformation}
					/>
					<FormLabel>Location</FormLabel>
				</FormField>
				<FormField>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.website}
						name="website"
						onBlur={handleUpdateUserInformation}
					/>
					<FormLabel>Website</FormLabel>
				</FormField>
				<FormField>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.pronouns}
						name="pronouns"
						onBlur={handleUpdateUserInformation}
					/>
					<FormLabel>Pronouns</FormLabel>
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
			</SettingsActions>
		</SettingsWrapper>
	)
}
