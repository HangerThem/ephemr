"use client"

import { io, Socket } from "socket.io-client"
import { useToast } from "@/context/toastContext"
import { createContext, useContext, useEffect, useState } from "react"

interface SocketContextProps {
  socket: Socket | undefined
  connect: () => void
  disconnect: () => void
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
)

interface IMessageProps {
  user: {
    username: string
    displayName: string
  }
  profilePic: string
  id: string
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>()
  const { addToastNotification } = useToast()
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"

  useEffect(() => {
    const newSocket = io(url, {
      auth: {
        token: localStorage.getItem("ephemrToken"),
      },
    })

    newSocket.on(
      "post-like",
      ({ user: { username, displayName }, profilePic, id }: IMessageProps) => {
        addToastNotification({
          title: "New post like",
          description: `${displayName} • @${username}`,
          seed: displayName,
          src: profilePic,
          type: "push",
          link: `/post/${id}`,
        })
      }
    )

    newSocket.on(
      "comment-like",
      ({ user: { username, displayName }, profilePic, id }: IMessageProps) => {
        addToastNotification({
          title: "New comment like",
          description: `${displayName} • @${username}`,
          seed: displayName,
          src: profilePic,
          type: "push",
          link: `/comment/${id}`,
        })
      }
    )

    newSocket.on(
      "mention",
      ({ user: { username, displayName }, profilePic, id }: IMessageProps) => {
        addToastNotification({
          title: "New mention",
          description: `${displayName} • @${username}`,
          seed: displayName,
          src: profilePic,
          type: "push",
          link: `/post/${id}`,
        })
      }
    )

    newSocket.on(
      "new-follow",
      ({ user: { username, displayName }, profilePic }: IMessageProps) => {
        addToastNotification({
          title: "New follow",
          description: `${displayName} • @${username}`,
          seed: displayName,
          src: profilePic,
          type: "push",
          link: `/${username}`,
        })
      }
    )

    setSocket(newSocket)

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [url])

  const connect = () => {
    if (socket) {
      socket.connect()
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket.close()
    }
  }

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}
