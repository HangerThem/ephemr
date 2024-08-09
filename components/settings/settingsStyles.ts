"use client"

import styled from "styled-components"

export const SettingsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: relative;
	width: 100%;
	gap: 5rem;
	height: 100vh;
	overflow: auto;
`

export const SectionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;

	& > h2 {
		font-size: 1.5rem;
		font-weight: 600;
	}
`

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	gap: 0.5rem;
	margin-top: 1rem;
	margin-bottom: 2rem;

	& > p {
		font-size: 1rem;
		color: rgb(var(--light));
		margin-bottom: 1rem;
	}
`

export const SettingsNav = styled.nav`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-end;
	position: sticky;
	padding-top: 5rem;
	top: 0;
	gap: 1rem;
	flex: 1;
	height: calc(100vh - 5.5rem);
	overflow: auto;

	a {
		text-decoration: none;
		color: rgba(var(--light), 0.75);
		transition: color 0.2s ease;

		&:hover,
		&:focus,
		&:active {
			color: rgb(var(--light));
		}
	}
`

export const SettingsActions = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	padding-top: 3rem;
`
