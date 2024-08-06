"use client"

import { withAuth } from "@/hoc/withAuth"

const Layout = ({ children }: { children: React.ReactNode }) => {
	return children
}

export default withAuth(Layout)
