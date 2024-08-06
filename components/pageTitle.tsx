"use client"

import Image from "next/image"
import styled from "styled-components"

const TitleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 2rem;
	gap: 10px;
`

const Title = styled.h1`
	font-size: 2rem;
	color: rgb(var(--light));
`

const PageTitle = () => {
	return (
	<TitleContainer>
		<Title>Ephemr</Title>
		<Image src="/images/logo.svg" alt="Ephemr Logo" width={50} height={50} />
	</TitleContainer>
	)
}

export default PageTitle
