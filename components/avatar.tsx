"use client"

import { createAvatar } from "@dicebear/core"
import styled from "styled-components"
import { initials } from "@dicebear/collection"
import { FC } from "react"
import Image from "next/image"

const AvatarContainer = styled.div`
	display: flex;
	align-items: center;
	position: relative;
`

const OnlineIndicator = styled.div<{
	$size: number
	$borderSize: number
	$borderColor: string
}>`
	width: ${({ $size }) => $size / 3.25}px;
	height: ${({ $size }) => $size / 3.25}px;
	background-color: rgb(var(--success));
	position: absolute;
	bottom: 0;
	right: 0;
	border-radius: 50%;
	border: ${({ $borderSize }) => $borderSize}px solid
	${({ $borderColor }) => $borderColor};
`

const AvatarImage = styled(Image)`
	border-radius: 50%;
`

interface AvatarProps {
	seed: string
	size: number
	src?: string
	online?: boolean
	borderSize?: number
	borderColor?: string
	radius?: number
}

const Avatar: FC<AvatarProps> = ({
	seed,
	size,
	src,
	online,
	borderSize = 3,
	borderColor = "rgb(var(--dark))",
	radius = 50,
}) => {
	const svg = createAvatar(initials, {
	seed,
	radius,
	size,
	}).toDataUri()

	return (
	<AvatarContainer>
		<AvatarImage src={src || svg} alt={seed} width={size} height={size} />
		{online && (
		<OnlineIndicator
			$size={size}
			$borderSize={borderSize}
			$borderColor={borderColor}
		/>
		)}
	</AvatarContainer>
	)
}

export default Avatar
