"use client"

import { FormField } from "@/components/forms/formStyles"
import {
	requestNotificationPermissions,
	requestUpdateNotificationPermissions,
} from "@/services/api-services/notificationService"
import {
	Section,
	SectionsContainer,
} from "@/components/settings/settingsStyles"
import Switch from "@/components/inputs/switch"
import { useEffect, useState } from "react"
import { isError } from "@/utils/isError"

export default function Page() {
	const [notifications, setNotifications] =
		useState<INotificationPermissions | null>(null)

	useEffect(() => {
		const getNotifications = async () => {
			const response = await requestNotificationPermissions()

			if (isError(response)) {
				return
			}

			setNotifications(response.notifications)
		}
		getNotifications()
	}, [])

	const saveNotifications = async (
		updatedNotifications: INotificationPermissions
	) => {
		const response = await requestUpdateNotificationPermissions(
			updatedNotifications
		)

		if (isError(response)) {
			return
		}

		setNotifications(response.notifications)
	}

	if (!notifications) {
		return (
			<SectionsContainer>
				<h2>Notifications</h2>
				<Section></Section>
			</SectionsContainer>
		)
	}

	return (
		<SectionsContainer>
			<h2>Notifications</h2>
			<Section>
				<FormField className="horizontal space-between">
					<p>In-app notifications</p>
					<Switch
						checked={notifications.inAppNotifications}
						onChange={() => {
							const updatedNotifications = {
								...notifications,
								inAppNotifications: !notifications.inAppNotifications,
							}
							setNotifications(updatedNotifications)
							saveNotifications(updatedNotifications)
						}}
					/>
				</FormField>
				<FormField className="horizontal space-between">
					<p>Push notifications</p>
					<Switch
						checked={notifications.pushNotifications}
						onChange={() => {
							const updatedNotifications = {
								...notifications,
								pushNotifications: !notifications.pushNotifications,
							}
							setNotifications(updatedNotifications)
							saveNotifications(updatedNotifications)
						}}
					/>
				</FormField>
				<FormField className="horizontal space-between">
					<p>Email notifications</p>
					<Switch
						checked={notifications.emailNotifications}
						onChange={() => {
							const updatedNotifications = {
								...notifications,
								emailNotifications: !notifications.emailNotifications,
							}
							setNotifications(updatedNotifications)
							saveNotifications(updatedNotifications)
						}}
					/>
				</FormField>
			</Section>
		</SectionsContainer>
	)
}
