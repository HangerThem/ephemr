import type { Metadata } from "next"
import { K2D } from "next/font/google"
import { ToastProvider } from "@/context/toastContext"
import { AuthProvider } from "@/context/authContext"
import { GlobalStyle } from "@/styles/global"
import StyledComponentsRegistry from "@/lib/registry"
import ToastContainer from "@/components/toastContainer"
import { PageContainer } from "@/components/containerStyles"
import { SocketProvider } from "@/context/socketContext"
import PageTitle from "@/components/pageTitle"

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
                <ToastContainer />
                <PageContainer className="center">
                  {/* <PageTitle /> */}
                  {children}
                </PageContainer>
              </body>
            </StyledComponentsRegistry>
          </AuthProvider>
        </SocketProvider>
      </ToastProvider>
    </html>
  )
}
