"use client"

import Avatar from "@/components/avatar"
import {
  ProfileHeader,
  ProfileTop,
  ProfileInfo,
  ProfileName,
  ProfileUsername,
  ProfileStats,
  ProfileStat,
} from "@/components/profile/profileStyles"
import { formatCount } from "@/utils/formatCount"
import ProfilPicture from "./profilePicture"
import { ModalContainer } from "@/components/modals/modalStyles"
import { useRef } from "react"
import { format } from "date-fns"
import { CalendarEvent, GeoAlt } from "react-bootstrap-icons"

export default function CurrentUserProfile({
  user,
}: {
  user: IUserFull | null
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
      </ProfileTop>
      <p>{user.userInformation.bio}</p>
      <p>
        <CalendarEvent />
        Joined {joined}
      </p>
      <p>
        <GeoAlt />
        Prague, Czech Republic
      </p>
    </ProfileHeader>
  )
}
