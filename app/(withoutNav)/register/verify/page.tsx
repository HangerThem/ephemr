"use client"

import { useRegisterContext } from "@/context/registerContext"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { requestEmail } from "@/services/api-services/authService"
import { isError } from "@/utils/isError"
import VerifyForm from "@/components/forms/VerifyForm"
import Link from "next/link"

export default function Page() {
  const { setStep } = useRegisterContext()
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState(
    useSearchParams().get("email")
  )
  const [code, setCode] = useState(useSearchParams().get("code"))

  useEffect(() => {
    setStep(2)

    if (!usernameOrEmail) {
      setUsernameOrEmail(localStorage.getItem("ephemrUsernameOrEmail") || "")
    }
  }, [])

  useEffect(() => {
    const emailCheck = async () => {
      if (!usernameOrEmail) {
        router.push("/register/basic")
      } else if (!usernameOrEmail.includes("@")) {
        const res = await requestEmail(usernameOrEmail)

        if (isError(res)) {
          router.push("/register/basic")
          return
        }

        setUsernameOrEmail(res.email)
      }
    }

    emailCheck()
  }, [usernameOrEmail])

  if (!usernameOrEmail || !usernameOrEmail.includes("@")) {
    return null
  }

  return (
    <>
      <VerifyForm email={usernameOrEmail as string} code={code as string} />
      <Link href="/register/details">Next</Link>
    </>
  )
}
