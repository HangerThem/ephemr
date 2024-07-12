"use client"

import { createAvatar } from "@dicebear/core"
import styled from "styled-components"
import { initials } from "@dicebear/collection"
import { FC } from "react"
import Image from "next/image"

const ProfilPictureContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const MoodIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 1.75rem;
  cursor: default;
`

const ProfilPictureImage = styled(Image)<{ $clickable: boolean }>`
  border-radius: 50%;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`

interface ProfilPictureProps {
  seed: string
  size: number
  src?: string
  mood?: IMood
  radius?: number
  onClick?: () => void
}

const ProfilPicture: FC<ProfilPictureProps> = ({
  seed,
  size,
  src,
  mood,
  radius = 50,
  onClick,
}) => {
  const svg = createAvatar(initials, {
    seed,
    radius,
    size,
  }).toDataUri()

  return (
    <ProfilPictureContainer>
      <ProfilPictureImage
        onClick={onClick}
        $clickable={!!onClick}
        src={src || svg}
        alt={seed}
        width={size}
        height={size}
      />
      {mood && <MoodIndicator>{mood.emoji}</MoodIndicator>}
    </ProfilPictureContainer>
  )
}

export default ProfilPicture
