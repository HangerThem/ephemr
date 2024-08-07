import styled from "styled-components"

export const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 2rem 0;
	width: 100%;
	max-width: 600px;
`

export const ProfileHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-direction: column;
	gap: 1rem;
	padding-bottom: 1rem;
	width: 100%;
	border-bottom: 1px solid rgba(var(--light), 0.1);
`

export const ProfileTop = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
`

export const ProfileInfo = styled.div`
	display: flex;
	flex-direction: column;
`

export const ProfileName = styled.h1`
	font-size: 1.5rem;
	color: rgb(var(--light));
`

export const ProfileUsername = styled.p`
	font-size: 0.9rem;
	color: rgba(var(--light), 0.5);
`

export const ProfileStats = styled.div`
	display: flex;
	margin-top: 1rem;
`

export const ProfileStat = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border-right: 1px solid rgb(var(--light));
	width: 100px;

	&:last-child {
		border-right: none;
	}
`

export const ProfileBio = styled.p`
	color: rgba(var(--light), 0.75);
	padding-left: 0.5rem;
	border-left: 4px solid rgba(var(--light), 0.5);
`

export const ProfileInformation = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	width: 100%;
`

export const ProfileInformationItem = styled.p`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	a:hover {
		text-decoration: underlineP;
	}
`
