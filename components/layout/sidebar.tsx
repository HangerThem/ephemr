"use client"

import styled from "styled-components"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import {
  HouseDoorFill,
  HouseDoor,
  PenFill,
  Pen,
  GearWideConnected,
  GearWide,
  ChatLeftTextFill,
  ChatLeftText,
  BellFill,
  Bell,
  DoorOpen,
  DoorClosed,
} from "react-bootstrap-icons"
import Image from "next/image"
import { usePathname } from "next/navigation"

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: rgb(var(--dark));
  color: rgb(var(--light));
  border-right: 1px solid rgba(var(--light), 0.1);
  height: 100vh;
  min-width: 200px;
  top: 0;
  left: 0;
`

const SidebarTitle = styled(Link)`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgb(var(--light));
`

const SidebarLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SidebarActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
`

const SidebarButton = styled.div`
  color: rgba(var(--light), 0.7);
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: rgb(var(--light));
  }
`

const SidebarLink = styled(Link)`
  color: rgba(var(--light), 0.7);
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  transition: color 0.2s;
  position: relative;

  &.active {
    color: rgb(var(--light));
  }

  &:hover {
    color: rgb(var(--light));
  }
`

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(var(--danger));
  color: rgb(var(--light));
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Sidebar = () => {
  const { user, logout, toggleModal } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname === `${path}/[id]`
  }

  const formatNotificationCount = (count: number) => {
    if (count > 9) {
      return "9+"
    }

    return count
  }

  return (
    <SidebarContainer>
      <SidebarTitle href="/" passHref>
        Ephemr
        <Image src="/images/logo.svg" alt="Ephemr" width={40} height={40} />
      </SidebarTitle>
      <SidebarLinks>
        <SidebarLink
          href="/"
          passHref
          className={isActive("/") ? "active" : ""}
        >
          {isActive("/") ? <HouseDoorFill /> : <HouseDoor />}
          Home
        </SidebarLink>
        {user ? (
          <>
            <SidebarLink
              href="/post/new"
              passHref
              className={isActive("/post/new") ? "active" : ""}
            >
              {isActive("/post/new") ? <PenFill /> : <Pen />}
              New post
            </SidebarLink>
            <SidebarLink
              href="/messages"
              passHref
              className={isActive("/messages") ? "active" : ""}
            >
              <NotificationBadge>
                {formatNotificationCount(11)}
              </NotificationBadge>
              {isActive("/messages") ? <ChatLeftTextFill /> : <ChatLeftText />}
              Messages
            </SidebarLink>
            <SidebarLink
              href="/notifications"
              passHref
              className={isActive("/notifications") ? "active" : ""}
            >
              <NotificationBadge>
                {formatNotificationCount(1)}
              </NotificationBadge>
              {isActive("/notifications") ? <BellFill /> : <Bell />}
              Notifications
            </SidebarLink>
            <SidebarLink
              href="/settings"
              passHref
              className={isActive("/settings") ? "active" : ""}
            >
              {isActive("/settings") ? <GearWideConnected /> : <GearWide />}
              Settings
            </SidebarLink>
          </>
        ) : null}
      </SidebarLinks>
      <SidebarActions>
        {user ? (
          <SidebarButton onClick={logout}>
            <DoorClosed />
            Logout
          </SidebarButton>
        ) : (
          <SidebarButton onClick={toggleModal}>
            <DoorOpen />
            Login
          </SidebarButton>
        )}
      </SidebarActions>
    </SidebarContainer>
  )
}

export default Sidebar
