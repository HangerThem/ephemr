"use client"

import { ModalContainer } from "@/components/modals/modalStyles"
import { useAuth } from "@/context/authContext"
import { useEffect, useRef } from "react"
import LoginForm from "@/components/forms/loginForm"
import RegisterForm from "@/components/forms/registerForm"

const AuthModal = () => {
	const { modalOpen, toggleModal } = useAuth()
	const modalRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
	if (modalOpen) {
		modalRef.current?.showModal()
	} else {
		modalRef.current?.close()
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
		<LoginForm />
	</ModalContainer>
	)
}

export default AuthModal
