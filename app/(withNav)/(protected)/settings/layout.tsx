import { Metadata } from "next"
import Link from "next/link"
import {
	SettingsWrapper,
	SettingsNav,
	SettingsActions,
} from "@/components/settings/settingsStyles"

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Ephemr • Settings",
	}
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<SettingsWrapper>
			<SettingsNav>
				<Link href="/settings/profile" passHref>
					Profile
				</Link>
				<Link href="/settings/security" passHref>
					Security
				</Link>
				<Link href="/settings/notifications" passHref>
					Notifications
				</Link>
				<Link href="/settings/data" passHref>
					Data
				</Link>
			</SettingsNav>
			<SettingsActions>{children}</SettingsActions>
		</SettingsWrapper>
	)
}
