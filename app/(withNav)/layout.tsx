import type { Metadata } from "next"
import { K2D } from "next/font/google"
import { ToastProvider } from "@/context/toastContext"
import { AuthProvider } from "@/context/authContext"
import { GlobalStyle, WithNavContainer } from "@/styles/global"
import StyledComponentsRegistry from "@/lib/registry"
import Sidebar from "@/components/layout/sidebar"
import AuthModal from "@/components/modals/authModal"
import ToastContainer from "@/components/toastContainer"
import Header from "@/components/layout/header"
import { PageContainer } from "@/components/containerStyles"
import { SocketProvider } from "@/context/socketContext"

const k2d = K2D({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Ephemr",
	description: "A social media platform for sharing your thoughts",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
	<html lang="en">
		<ToastProvider>
		<SocketProvider>
			<AuthProvider>
			<StyledComponentsRegistry>
				<GlobalStyle />
				<body className={k2d.className}>
				<WithNavContainer>
					<ToastContainer />
					<AuthModal />
					<Sidebar />
					<PageContainer>
					<Header />
					{children}
					</PageContainer>
				</WithNavContainer>
				</body>
			</StyledComponentsRegistry>
			</AuthProvider>
		</SocketProvider>
		</ToastProvider>
	</html>
	)
}
