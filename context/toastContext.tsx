"use client"

import { createContext, useState, useContext, useEffect } from "react"
import crypto from "crypto"

interface ToastContextProps {
  toastNotifications: ToastNotificationFull[]
  addToastNotification: (toastNotification: ToastNotificationSimple) => void
  removeToastNotification: (id: string) => void
}

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

/**
 * Provides toast notification functionality for the application.
 * @component
 * @param {ToastProviderProps} props - The props for the component.
 * @returns {React.ReactElement}
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
}: ToastProviderProps): React.ReactElement => {
  const [toastNotifications, setToastNotifications] = useState<
    ToastNotificationFull[]
  >([])

  /**
   * Adds a toast notification to the list of notifications.
   * @param toastNotification
   * @returns {void}
   */
  const addToastNotification = (
    toastNotification: ToastNotificationSimple
  ): void => {
    const id = crypto.randomBytes(16).toString("hex")
    setToastNotifications((prevToasts) => [
      ...prevToasts,
      {
        ...toastNotification,
        id,
        ttl: toastNotification.ttl || 5000,
      },
    ])

    const audio = new Audio("/sounds/notification.mp3")
    if (audio.canPlayType("audio/mpeg")) {
      audio.play()
    } else {
      console.error("Audio not supported")
    }

    setTimeout(() => removeToastNotification(id), toastNotification.ttl || 5000)
  }

  /**
   * Removes a toast notification from the list of notifications.
   * @param {string} id - The ID of the notification to remove.
   * @returns {void}
   */
  const removeToastNotification = (id: string): void => {
    setToastNotifications((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== id)
    )
  }

  return (
    <ToastContext.Provider
      value={{
        toastNotifications,
        addToastNotification,
        removeToastNotification,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Custom hook to use the toast notification functionality.
 * @returns {ToastContextProps} The toast notification context.
 */
export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
