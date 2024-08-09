"use client"

import { FormField } from "@/components/forms/formStyles"
import {
	requestPrivacy,
	requestUpdatePrivacy,
} from "@/services/api-services/privacyService"
import {
	Section,
	SectionsContainer,
} from "@/components/settings/settingsStyles"
import Switch from "@/components/inputs/switch"
import { useEffect, useState } from "react"
import { isError } from "@/utils/isError"

export default function Page() {
	const [privacy, setPrivacy] = useState<IPrivacy | null>(null)

	useEffect(() => {
		const getPrivacy = async () => {
			const response = await requestPrivacy()

			if (isError(response)) {
				return
			}

			setPrivacy(response.privacy)
		}
		getPrivacy()
	}, [])

	const savePrivacy = async (updatedPrivacy: IPrivacy) => {
		const response = await requestUpdatePrivacy(updatedPrivacy)

		if (isError(response)) {
			return
		}

		setPrivacy(response.privacy)
	}

	if (!privacy) {
		return (
			<SectionsContainer>
				<h2>Privacy</h2>
				<Section></Section>
			</SectionsContainer>
		)
	}

	return (
		<SectionsContainer>
			<h2>Privacy</h2>
			<Section>
				<FormField className="horizontal space-between">
					<p>Private account</p>
					<Switch
						checked={privacy.privateStatus}
						onChange={() => {
							const updatedPrivacy = {
								...privacy,
								privateStatus: !privacy.privateStatus,
							}
							setPrivacy(updatedPrivacy)
							savePrivacy(updatedPrivacy)
						}}
					/>
				</FormField>
				<FormField className="horizontal space-between">
					<p>Show activity status</p>
					<Switch
						checked={privacy.activityStatus}
						onChange={() => {
							const updatedPrivacy = {
								...privacy,
								activityStatus: !privacy.activityStatus,
							}
							setPrivacy(updatedPrivacy)
							savePrivacy(updatedPrivacy)
						}}
					/>
				</FormField>
			</Section>
		</SectionsContainer>
	)
}
