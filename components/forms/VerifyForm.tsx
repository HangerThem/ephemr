"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { requestVerify } from "@/services/api-services/authService"
import {
  Form,
  FormTitle,
  FormField,
  FormCodeContainer,
  FormCodeInput,
  ErrorMessage,
} from "@/components/forms/formStyles"
import Button from "@/components/buttons/button"
import { isError } from "@/utils/isError"

interface VerifyFormProps {
  email: string
  code?: string
}

export default function VerifyForm({ email, code }: VerifyFormProps) {
  const [error, setError] = useState("")
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const code = inputRefs.current.reduce(
      (acc, input) => acc + (input?.value || ""),
      ""
    )

    const response = await requestVerify(email, code)

    if (isError(response)) {
      setError(response.error)
      return
    }

    router.push("/register/details")
  }

  const focusNextInput = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6)
    pasteData.split("").forEach((char, index) => {
      const input = inputRefs.current[index]
      if (input) {
        input.value = char
        focusNextInput(index)
      }
    })
    e.preventDefault()
  }

  if (code) {
    code.split("").forEach((char, index) => {
      const input = inputRefs.current[index]
      if (input) {
        input.value = char
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormTitle>Verify</FormTitle>
      <FormField>
        <FormCodeContainer>
          {Array.from({ length: 6 }).map((_, i) => (
            <FormCodeInput
              key={i}
              type="text"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              onChange={() => focusNextInput(i)}
              onPaste={i === 0 ? handlePaste : undefined}
            />
          ))}
        </FormCodeContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormField>
      <Button type="submit">Verify</Button>
    </Form>
  )
}
