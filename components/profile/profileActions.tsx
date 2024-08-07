"use client"

import Button from "../buttons/button"
import styled from "styled-components"
import ShareModal from "../modals/shareModal"
import { useAuth } from "@/context/authContext"
import { useState, FC } from "react"

const ActionContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
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
	const [shareModalOpen, setShareModalOpen] = useState<boolean>(false)

	const [isFollowing, setIsFollowing] = useState<boolean>(
		userData.isFollowing || false
	)
	const handleShare = () => {
		if (navigator.share) {
			try {
				navigator.share({
					title: "Check out this profile!",
					text: `Check out the profile of ${userData.username}`,
					url: window.location.href,
				})
				console.log("Profile shared successfully")
			} catch (error) {
				console.error("Error sharing the profile:", error)
			}
		} else {
			setShareModalOpen(true)
		}
	}

	if (currentUser) {
		return (
			<ActionContainer>
				<ShareModal
					username={userData.username}
					modalOpen={shareModalOpen}
					toggleModal={setShareModalOpen}
				/>
				<Button link="/settings">Edit</Button>
				<Button onClick={handleShare}>Share</Button>
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
			<ShareModal
				username={userData.username}
				modalOpen={shareModalOpen}
				toggleModal={setShareModalOpen}
			/>
			{isFollowing ? (
				<Button onClick={handleFollow} className="danger">
					Unfollow
				</Button>
			) : (
				<Button onClick={handleFollow}>Follow</Button>
			)}
			<Button link={`/messages/${userData.id}`}>Message</Button>
			<Button onClick={handleShare}>Share</Button>
		</ActionContainer>
	)
}

export default ProfileActions
