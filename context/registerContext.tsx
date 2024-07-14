"use client"

import { createContext, useContext, useState } from "react"

interface RegisterContextProps {
  step: number
  setStep: (step: number) => void
}

export const RegisterContext = createContext<RegisterContextProps | undefined>(
  undefined
)

export const RegisterProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [step, setStep] = useState(1)

  return (
    <RegisterContext.Provider
      value={{
        step,
        setStep,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

export const useRegisterContext = () => {
  const context = useContext(RegisterContext)
  if (context === undefined) {
    throw new Error("useRegisterContext must be used within a SocketProvider")
  }
  return context
}
