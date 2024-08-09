"use client"

import {
	FormArea,
	FormField,
	FormInput,
	FormFieldDouble,
	FormLabel,
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
import { useEffect, useState } from "react"
import {
	SectionsContainer,
	Section,
} from "@/components/settings/settingsStyles"

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
	const [errors, setErrors] = useState({
		displayName: "",
	})
	const [changed, setChanged] = useState(false)

	useEffect(() => {
		if (
			user?.displayName !== userData.displayName ||
			user?.userInformation.bio !== userInformation.bio ||
			user?.userInformation.location !== userInformation.location ||
			user?.userInformation.website !== userInformation.website ||
			user?.userInformation.pronouns !== userInformation.pronouns
		) {
			setChanged(true)
		} else {
			setChanged(false)
		}
	}, [userData, userInformation, user])

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
		<SectionsContainer>
			<h2>Profile</h2>
			<Section>
				<p>Profile information</p>
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
							if (parseInt(file?.size?.toString() ?? "") > 1000000) {
								return
							}
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
					<FormField>
						<FormInput
							type="text"
							defaultValue={user?.displayName}
							name="displayName"
							minLength={3}
							onChange={(e) => {
								setUserData({
									...userData,
									displayName: e.target.value,
								})
							}}
						/>
						<FormLabel className="bg-transparent">Display Name</FormLabel>
					</FormField>
					<FormField>
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
						<FormLabel className="bg-transparent">Pronouns</FormLabel>
						<datalist id="pronouns-list">
							<option value="He/Him" />
							<option value="She/Her" />
							<option value="They/Them" />
						</datalist>
					</FormField>
				</FormFieldDouble>
				<FormFieldDouble>
					<FormField>
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
						<FormLabel className="bg-transparent">Location</FormLabel>
					</FormField>
					<FormField>
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
						<FormLabel className="bg-transparent">Website</FormLabel>
					</FormField>
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
					<FormLabel className="bg-transparent">Bio</FormLabel>
				</FormField>
				<Button onClick={handleSave} disabled={!changed} loading={loading}>
					Save
				</Button>
			</Section>
		</SectionsContainer>
	)
}
