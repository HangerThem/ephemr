import { RegisterProvider } from "@/context/registerContext"
import StepIndicator from "@/components/stepIndicator"

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
	<RegisterProvider>
		<StepIndicator />
		{children}
	</RegisterProvider>
	)
}
