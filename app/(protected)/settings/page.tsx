"use client"

import { downloadDataService } from "@/services/api-services/downloadDataService"
import {
  FormField,
  FormInput,
  FormLabel as PrestyledFormLabel,
  FormArea,
} from "@/components/forms/formStyles"
import { requestUpdateMe } from "@/services/api-services/meService"
import styled from "styled-components"
import { useAuth } from "@/context/authContext"

const FormLabel = styled(PrestyledFormLabel)`
  background-color: rgb(var(--background));
`

export default function Page() {
  const { user, getUser } = useAuth()

  const handleDownload = async () => {
    try {
      const response = await downloadDataService()
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(response, null, 2)])
      )
      const a = document.createElement("a")
      a.href = url
      a.download = "user_data.json"
      a.click()
    } catch (e) {
      console.error("Error downloading data: ", e)
    }
  }

  const handleUpdate = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    try {
      await requestUpdateMe({ [name]: value })
      getUser()
    } catch (e) {
      console.error("Error updating user: ", e)
    }
  }

  return (
    <div>
      <section>
        <h1>Profile Information</h1>
        <FormField>
          <FormInput
            type="text"
            defaultValue={user?.displayName}
            name="displayName"
            onBlur={handleUpdate}
          />
          <FormLabel>Display Name</FormLabel>
        </FormField>
        <FormField>
          <FormInput
            type="email"
            defaultValue={user?.email}
            name="email"
            onBlur={handleUpdate}
          />
          <FormLabel>Email</FormLabel>
        </FormField>
        <FormField>
          <FormArea defaultValue={user?.bio} name="bio" onBlur={handleUpdate} />
          <FormLabel>Bio</FormLabel>
        </FormField>
        <FormField>
          <FormInput
            type="text"
            defaultValue={user?.pronouns}
            name="pronouns"
            onBlur={handleUpdate}
          />
          <FormLabel>Pronouns</FormLabel>
        </FormField>
      </section>
    </div>
  )
}
