"use client"

export default function SocketPage({ params }: { params: { roomId: string } }) {
	return (
	<>
		<h1>Socket Page</h1>
		<p>Room ID: {params.roomId}</p>
	</>
	)
}
