"use client"

import styled from "styled-components"
import { useAuth } from "@/context/authContext"
import { ProfileLink } from "../post/commentStyles"
import Avatar from "@/components/avatar"

const ProfileTabContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
`

const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;

	h3 {
	font-size: 1rem;
	font-weight: 500;
	}

	p {
	font-size: 0.75rem;
	color: rgba(var(--light), 0.5);
	}
`

const ProfileTab = () => {
	const { user } = useAuth()

	if (!user) {
	return null
	}

	return (
	<ProfileTabContainer>
		<ProfileLink href={`/${user.username}`}>
		<Avatar
			seed={user.displayName}
			src={user.profilePic}
			size={30}
			online={user.online}
			borderColor="
			rgb(var(--background))
		"
		/>
		<ProfileWrapper>
			<h3>{user.displayName}</h3>
			<p>@{user.username}</p>
		</ProfileWrapper>
		</ProfileLink>
	</ProfileTabContainer>
	)
}

export default ProfileTab
