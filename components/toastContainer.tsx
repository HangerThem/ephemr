"use client"

import styled from "styled-components"
import { useToast } from "@/context/toastContext"
import {
  InfoCircle,
  XCircle,
  ExclamationTriangle,
  Check2Circle,
  X,
} from "react-bootstrap-icons"
import Avatar from "./avatar"
import Link from "next/link"

const Container = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 99;
`

const Toast = styled(Link)<{ $link: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background-color: rgb(var(--background));
  border: 1px solid rgba(var(--light), 0.1);
  border-radius: 8px;
  width: 350px;
  color: rgb(var(--light));
  cursor: ${({ $link }) => ($link ? "pointer" : "default")};
  text-decoration: none;
`

const ToastInfo = styled.div`
  display: flex;
  gap: 1rem;
`

const ToastTitle = styled.h1`
  font-size: 1rem;
  font-weight: 500;
`

const ToastMessage = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`

const ToastClose = styled(X)`
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: rgba(var(--light), 0.5);
  font-size: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
`

const ToastIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ToastContainer = () => {
  const { toastNotifications, removeToastNotification } = useToast()

  const getIcon = (type: ToastNotificationFull["type"]) => {
    const iconSize = 36
    switch (type) {
      case "info":
        return <InfoCircle size={iconSize} />
      case "error":
        return <XCircle size={iconSize} />
      case "warning":
        return <ExclamationTriangle size={iconSize} />
      case "success":
        return <Check2Circle size={iconSize} />
      default:
        return <InfoCircle size={iconSize} />
    }
  }

  return (
    <Container>
      {toastNotifications.map((toast) => (
        <Toast
          key={toast.id}
          href={toast.link || "#"}
          $link={toast.link !== undefined}
        >
          <ToastInfo>
            <ToastIcon>
              {toast.type === "push" ? (
                <Avatar 
                src={toast?.src || ""}
                seed={toast?.seed || ""} size={36} />
              ) : (
                getIcon(toast.type)
              )}
            </ToastIcon>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.description}</ToastMessage>
            </div>
          </ToastInfo>
          <ToastClose
            onClick={(e) => {
              e.stopPropagation()
              removeToastNotification(toast.id)
            }}
          />
        </Toast>
      ))}
    </Container>
  )
}

export default ToastContainer
