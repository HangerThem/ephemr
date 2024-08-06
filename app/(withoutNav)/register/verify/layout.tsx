import { Suspense } from "react"
import PageLoader from "@/components/loaders/pageLoader"

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
