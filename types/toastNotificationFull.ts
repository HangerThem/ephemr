type ToastNotificationFull = {
	id: string
	type: "warning" | "info" | "success" | "error" | "push"
	title: string
	seed?: string
	src?: string
	link?: string
	description?: string
	ttl: number
}
