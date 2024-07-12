import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import PageLoader from "@/components/loaders/pageLoader"

/**
 * Higher-order component that adds authentication logic to a wrapped component.
 * @param WrappedComponent - The component to be wrapped with authentication logic.
 * @returns The wrapped component with authentication logic.
 */
export function withAuth(WrappedComponent: React.ComponentType<any>) {
  return function WithAuthComponent(props: any) {
    const { token, loading, toggleModal } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !token) {
        toggleModal()
        router.push("/")
      }
    }, [loading, token])

    if (loading || !token) {
      return <PageLoader />
    }

    return <WrappedComponent {...props} />
  }
}
