"use client"

import { requestDownloadData } from "@/services/api-services/downloadDataService"
import { requestDeleteMe } from "@/services/api-services/meService"
import Button from "@/components/buttons/button"
import {
	Section,
	SectionsContainer,
} from "@/components/settings/settingsStyles"
import { useCallback, useState } from "react"
import VerifyDeleteModal from "@/components/modals/verifyDeleteModal"

export default function Page() {
	const [openModal, setOpenModal] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDownloadData = useCallback(async () => {
		setLoading(true)
		const data = await requestDownloadData()

		const blob = new Blob([JSON.stringify(data)], {
			type: "application/json",
		})

		const url = URL.createObjectURL(blob)

		const a = document.createElement("a")
		a.download = "user_data.json"
		a.href = url
		a.click()
		setLoading(false)
	}, [])

	const handleDeleteAccount = useCallback(async () => {
		await requestDeleteMe()
	}, [])

	return (
		<SectionsContainer>
			<VerifyDeleteModal
				modalOpen={openModal}
				toggleModal={setOpenModal}
				onSubmit={handleDeleteAccount}
			/>
			<h2>Data</h2>
			<Section>
				<p>Data related to your account</p>
				<Button onClick={handleDownloadData} size="large" loading={loading}>
					Download data
				</Button>
			</Section>
			<h2>Danger Zone</h2>
			<Section>
				<p>Delete your account</p>
				<Button
					onClick={() => setOpenModal(true)}
					size="large"
					className="danger"
				>
					Delete account
				</Button>
			</Section>
		</SectionsContainer>
	)
}
