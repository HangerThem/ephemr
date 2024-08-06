import { Metadata } from "next"
import { Suspense } from "react"
import PageLoader from "@/components/loaders/pageLoader"

export async function generateMetadata(): Promise<Metadata> {
	return {
	title: "Ephemr • Search",
	}
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
