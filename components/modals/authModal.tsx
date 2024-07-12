"use client"

import { ModalContainer } from "@/components/modals/modalStyles"
import { useAuth } from "@/context/authContext"
import { useEffect, useRef, useState } from "react"
import LoginForm from "@/components/forms/loginForm"
import RegisterForm from "@/components/forms/registerForm"

const AuthModal = () => {
  const { modalOpen, toggleModal } = useAuth()
  const modalRef = useRef<HTMLDialogElement>(null)
  const [login, setLogin] = useState(true)

  useEffect(() => {
    if (modalOpen) {
      modalRef.current?.showModal()
    } else {
      modalRef.current?.close()
      setLogin(true)
    }
  }, [modalOpen])

  if (typeof window !== "undefined") {
    window.onclick = (e) => {
      if (e.target === modalRef.current) {
        toggleModal()
      }
    }
  }

  return (
    <ModalContainer ref={modalRef}>
      {login ? (
        <LoginForm toggleLogin={() => setLogin(false)} />
      ) : (
        <RegisterForm toggleLogin={() => setLogin(true)} />
      )}
    </ModalContainer>
  )
}

export default AuthModal
