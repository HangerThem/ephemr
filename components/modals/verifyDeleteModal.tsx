"use client"

import { ModalContainer, ModalClose } from "@/components/modals/modalStyles"
import { useAuth } from "@/context/authContext"
import { FC, useEffect, useRef, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
	ErrorMessage,
	Form,
	FormField,
	FormInput,
	FormLabel,
	FormTitle,
	FormSubtitle,
} from "../forms/formStyles"
import Button from "../buttons/button"

interface VerifyDeleteModalProps {
	modalOpen: boolean
	toggleModal: React.Dispatch<React.SetStateAction<boolean>>
	onSubmit: () => void
}

const VerifyDeleteModal: FC<VerifyDeleteModalProps> = ({
	modalOpen,
	toggleModal,
	onSubmit,
}) => {
	const { user } = useAuth()
	const router = useRouter()
	const [error, setError] = useState("")
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
				toggleModal(false)
			}
		}
		window.onkeydown = (e) => {
			if (e.key === "Escape") {
				toggleModal(false)
			}
		}
	}

	const handleDelete = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const username = (
			e.target as typeof e.target & { username: { value: string } }
		).username.value
		if (username === user?.username) {
			onSubmit()
			toggleModal(false)
			router.push("/")
		} else {
			setError("Username does not match")
		}
	}

	return (
		<ModalContainer ref={modalRef}>
			<ModalClose onClick={() => toggleModal(false)} />
			<Form onSubmit={handleDelete}>
				<FormTitle>Delete Account</FormTitle>
				<FormSubtitle>Enter your username to confirm deletion</FormSubtitle>
				<FormField className={error ? "error" : ""}>
					<FormInput type="text" id="username" />
					<FormLabel htmlFor="username">Username</FormLabel>
					{error && <ErrorMessage>{error}</ErrorMessage>}
				</FormField>
				<Button type="submit" className="danger">
					Delete
				</Button>
			</Form>
		</ModalContainer>
	)
}

export default VerifyDeleteModal
