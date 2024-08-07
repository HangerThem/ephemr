"use client"

import {
	ProfileHeader,
	ProfileTop,
	ProfileInfo,
	ProfileName,
	ProfileUsername,
	ProfileStats,
	ProfileStat,
	ProfileBio,
	ProfileInformation,
	ProfileInformationItem,
} from "@/components/profile/profileStyles"
import ProfileActions from "./profileActions"
import { formatCount } from "@/utils/formatCount"
import ProfilPicture from "./profilePicture"
import { ModalContainer } from "@/components/modals/modalStyles"
import { useRef } from "react"
import { format } from "date-fns"
import { CalendarEvent, GeoAlt, Globe2 } from "react-bootstrap-icons"
import Link from "next/link"

export default function CurrentUserProfile({
	user,
	refreshData,
	currentUser,
}: {
	user: IUserFull | null
	refreshData: (isFollowing: boolean) => void
	currentUser: boolean
}) {
	const modalRef = useRef<HTMLDialogElement>(null)

	if (!user) {
		return null
	}

	if (typeof window !== "undefined") {
		window.onclick = (e) => {
			if (e.target === modalRef.current) {
				modalRef.current?.close()
			}
		}
	}

	const joined = format(new Date(user.createdAt), "MMMM yyyy")

	return (
		<ProfileHeader>
			<ModalContainer ref={modalRef}>
				<ProfilPicture
					seed={user.displayName}
					size={250}
					src={user.profilePic}
				/>
			</ModalContainer>
			<ProfileTop>
				<ProfilPicture
					seed={user.displayName}
					size={125}
					src={user.profilePic}
					mood={user.mood}
					onClick={() => modalRef.current?.showModal()}
				/>
				<ProfileInfo>
					<ProfileName>
						{user.displayName}{" "}
						{user.userInformation.pronouns &&
							`(${user.userInformation.pronouns})`}
					</ProfileName>
					<ProfileUsername>@{user.username}</ProfileUsername>
					<ProfileStats>
						<ProfileStat>
							<span>{formatCount(user._count.followers)}</span>
							<span>Followers</span>
						</ProfileStat>
						<ProfileStat>
							<span>{formatCount(user._count.following)}</span>
							<span>Following</span>
						</ProfileStat>
						<ProfileStat>
							<span>{formatCount(user._count.posts)}</span>
							<span>Posts</span>
						</ProfileStat>
					</ProfileStats>
				</ProfileInfo>
				<ProfileActions
					userData={user}
					refreshData={refreshData}
					currentUser={currentUser}
				/>
			</ProfileTop>
			{user.userInformation.bio && (
				<ProfileBio>{user.userInformation.bio}</ProfileBio>
			)}
			<ProfileInformation>
				<ProfileInformationItem>
					<CalendarEvent />
					{joined}
				</ProfileInformationItem>
				{user.userInformation.location && (
					<ProfileInformationItem>
						<GeoAlt />
						{user.userInformation.location}
					</ProfileInformationItem>
				)}
				{user.userInformation.website && (
					<ProfileInformationItem>
						<Globe2 />
						<Link
							href={user.userInformation.website}
							target="_blank"
							rel="noreferrer"
						>
							{user.userInformation.website.split("://")[1]}
						</Link>
					</ProfileInformationItem>
				)}
			</ProfileInformation>
		</ProfileHeader>
	)
}
