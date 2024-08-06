"use client"

import styled from "styled-components"
import Button from "../buttons/button"
import { useAuth } from "@/context/authContext"
import { FC, useState } from "react"

const ActionContainer = styled.div`
	display: flex;
	gap: 1rem;
	padding: 1rem;
`

interface ProfileActionsProps {
	userData: IUserFull
	refreshData?: (isFollowing: boolean) => void
	currentUser?: boolean
}

const ProfileActions: FC<ProfileActionsProps> = ({
	userData,
	refreshData,
	currentUser = false,
}) => {
	const { toggleModal, user: isLoggedIn } = useAuth()

	const [isFollowing, setIsFollowing] = useState<boolean>(
	userData.isFollowing || false
	)

	if (currentUser) {
	return (
		<ActionContainer>
		<Button link="/settings">Edit Profile</Button>
		</ActionContainer>
	)
	}

	const handleFollow = async () => {
	if (!isLoggedIn) {
		toggleModal()
		return
	}
	if (!refreshData) return
	if (isFollowing) {
		refreshData(isFollowing)
		setIsFollowing(false)
	} else {
		refreshData(isFollowing)
		setIsFollowing(true)
	}
	}

	return (
	<ActionContainer>
		{isFollowing ? (
		<Button onClick={handleFollow} className="danger">
			Unfollow
		</Button>
		) : (
		<Button onClick={handleFollow}>Follow</Button>
		)}
		<Button link={`/messages/${userData.id}`}>Message</Button>
	</ActionContainer>
	)
}

export default ProfileActions
