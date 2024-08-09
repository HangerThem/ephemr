"use client"

import {
	FormArea,
	FormField,
	FormInput,
	FormFieldDouble,
	FormLabel as PrestyledLabel,
} from "@/components/forms/formStyles"
import {
	requestUpdateMe,
	requestDeleteProfilePic,
	requestUpdateProfilePic,
	requestUpdateUserInformation,
} from "@/services/api-services/meService"
import { createAvatar } from "@dicebear/core"
import { initials } from "@dicebear/collection"
import Image from "next/image"
import { useAuth } from "@/context/authContext"
import styled from "styled-components"
import Button from "@/components/buttons/button"
import { useState } from "react"

const FormLabel = styled(PrestyledLabel)`
	background-color: rgb(var(--background));
`

const Section = styled.section`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;

	& {
		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin-bottom: 1rem;
		}

		p {
			font-size: 1rem;
			color: rgb(var(--light));
			margin-bottom: 1rem;
		}
	}
`

const ProfilePic = styled(Image)`
	border-radius: 50%;
`

export default function Page() {
	const { user, getUser } = useAuth()
	const [loading, setLoading] = useState(false)
	const [profilePic, setProfilePic] = useState<File | null>(null)
	const [userInformation, setUserInformation] = useState({
		bio: user?.userInformation.bio,
		location: user?.userInformation.location,
		website: user?.userInformation.website,
		pronouns: user?.userInformation.pronouns,
	})
	const [userData, setUserData] = useState({
		displayName: user?.displayName,
		username: user?.username,
	})

	const handleSave = async () => {
		setLoading(true)
		profilePic && (await requestUpdateProfilePic(profilePic))
		userInformation && (await requestUpdateUserInformation(userInformation))
		userData && (await requestUpdateMe(userData))
		getUser()
		setLoading(false)
	}

	const profilePicSrc = profilePic
		? URL.createObjectURL(profilePic)
		: user?.profilePic ||
		  createAvatar(initials, {
				seed: user?.displayName as string,
				radius: 50,
				size: 100,
		  }).toDataUri()

	return (
		<Section>
			<h2>Profile</h2>
			<FormField className="horizontal">
				<ProfilePic
					src={profilePicSrc}
					alt={user?.displayName as string}
					width={100}
					height={100}
				/>
				<FormInput
					type="file"
					accept="image/*"
					name="profilePic"
					id="profilePic"
					onChange={(e) => {
						const file = e.target.files?.[0]
						if (file) {
							setProfilePic(file)
						}
					}}
					hidden
				/>
				<Button
					onClick={() => {
						const input = document.getElementById(
							"profilePic"
						) as HTMLInputElement
						input.click()
					}}
				>
					Add new
				</Button>
				<Button
					className="danger"
					onClick={async () => {
						await requestDeleteProfilePic()
						getUser()
					}}
				>
					Delete
				</Button>
			</FormField>
			<FormFieldDouble>
				<div>
					<FormInput
						type="text"
						defaultValue={user?.displayName}
						name="displayName"
						onChange={(e) => {
							setUserData({
								...userData,
								displayName: e.target.value,
							})
						}}
					/>
					<FormLabel>Display Name</FormLabel>
				</div>
				<div>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.pronouns}
						name="pronouns"
						list="pronouns-list"
						onChange={(e) => {
							setUserInformation({
								...userInformation,
								pronouns: e.target.value,
							})
						}}
					/>
					<datalist id="pronouns-list">
						<option value="He/Him" />
						<option value="She/Her" />
						<option value="They/Them" />
					</datalist>
					<FormLabel>Pronouns</FormLabel>
				</div>
			</FormFieldDouble>
			<FormFieldDouble>
				<div>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.location}
						name="location"
						onChange={(e) => {
							setUserInformation({
								...userInformation,
								location: e.target.value,
							})
						}}
					/>
					<FormLabel>Location</FormLabel>
				</div>
				<div>
					<FormInput
						type="text"
						defaultValue={user?.userInformation.website}
						name="website"
						onChange={(e) => {
							setUserInformation({
								...userInformation,
								website: e.target.value,
							})
						}}
					/>
					<FormLabel>Website</FormLabel>
				</div>
			</FormFieldDouble>
			<FormField>
				<FormArea
					className="bg-transparent"
					defaultValue={user?.userInformation.bio}
					name="bio"
					onChange={(e) => {
						setUserInformation({
							...userInformation,
							bio: e.target.value,
						})
					}}
				/>
				<FormLabel>Bio</FormLabel>
			</FormField>
			<Button
				onClick={handleSave}
				disabled={
					!profilePic &&
					!userInformation &&
					!userData.displayName &&
					!userData.username
				}
				loading={loading}
			>
				Save
			</Button>
		</Section>
	)
}
