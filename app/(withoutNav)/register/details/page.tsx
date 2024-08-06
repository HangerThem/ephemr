"use client"

import RegisterForm from "@/components/forms/registerForm"
import { useRegisterContext } from "@/context/registerContext"
import { useEffect } from "react"
import Link from "next/link"

export default function Page() {
	const { setStep } = useRegisterContext()

	useEffect(() => {
	setStep(3)
	}, [])

	return (
	<>
		<Link href="/register/basic">Next</Link>
	</>
	)
}
