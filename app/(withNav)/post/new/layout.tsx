import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
	return {
	title: "New post",
	}
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return children
}
