import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ephemr • Settings",
  }
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
