"use client"

import { ModalContainer, ModalClose } from "@/components/modals/modalStyles"
import ShareModalContent from "@/components/modals/shareModalContent"
import { FC, useEffect, useRef } from "react"

interface ShareModalProps {
	username: string
	modalOpen: boolean
	toggleModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ShareModal: FC<ShareModalProps> = ({
	username,
	modalOpen,
	toggleModal,
}) => {
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

	return (
		<ModalContainer ref={modalRef}>
			<ModalClose onClick={() => toggleModal(false)} />
			<ShareModalContent username={username} />
		</ModalContainer>
	)
}

export default ShareModal
