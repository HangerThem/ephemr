import styled from "styled-components"
import { EyeFill, EyeSlashFill, X } from "react-bootstrap-icons"
import Link from "next/link"

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 350px;
	gap: 1rem;
	background-color: rgb(var(--dark));
	padding: 1rem;
	border-radius: 5px;
	border: 1px solid rgba(var(--light), 0.25);

	&.full {
		width: 100%;
	}
`

export const FormTitle = styled.h1`
	font-size: 1.5rem;
	color: rgb(var(--light));
`

export const FormClose = styled(X)`
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 20px;
	cursor: pointer;
	color: rgba(var(--light), 0.5);
	transition: color 0.2s;

	&:hover {
		color: rgb(var(--light));
	}
`

export const FormLabel = styled.label`
	font-size: 1rem;
	margin-bottom: 0.5rem;
	position: absolute;
	color: rgba(var(--light), 0.5);
	font-size: 0.8rem;
	top: -25%;
	left: 5px;
	background-color: rgb(var(--dark));
	padding: 0 0.5rem;
	transition: color 0.2s ease;
`

export const FormInput = styled.input`
	width: 100%;
	background-color: transparent;
	border: 1px solid rgba(var(--light), 0.2);
	border-radius: 5px;
	color: rgb(var(--light));
	padding: 0.5rem;
	font-size: 0.9rem;
	outline: none;
	transition: border 0.2s ease;

	&:focus {
		border: 1px solid rgb(var(--light));
	}

	&:focus + ${FormLabel} {
		color: rgb(var(--light));
	}

	&.password {
		padding-right: 2rem;
	}
`

export const FormCodeContainer = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
`

export const FormCodeInput = styled.input`
	background-color: transparent;
	border: 1px solid rgba(var(--light), 0.2);
	border-radius: 5px;
	color: rgb(var(--light));
	font-size: 1.25rem;
	width: 32px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	outline: none;
	transition: border 0.2s ease;

	&:focus {
		border: 1px solid rgb(var(--light));
	}
`

export const FormArea = styled.textarea`
	width: 100%;
	background-color: rgba(var(--light), 0.1);
	color: rgb(var(--light));
	border: none;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	padding: 0.5rem;
	resize: none;
	outline: none;
	font-family: inherit;
	margin-bottom: 0.5rem;
	scrollbar-width: none;
	height: fit-content;
	border: 1px solid rgba(var(--light), 0.2);
	word-wrap: break-word;
	overflow-wrap: break-word;

	&:focus {
		border: 1px solid rgb(var(--light));
	}
`

export const FormField = styled.div`
	position: relative;
	width: 100%;
	max-width: 350px;
	margin-bottom: 1rem;

	&.error {
		${FormInput} {
			border: 1px solid rgb(var(--danger));
		}

		${FormArea} {
			border: 1px solid rgb(var(--danger));
		}

		${FormCodeInput} {
			border: 1px solid rgb(var(--danger));
		}

		${FormLabel} {
			color: rgb(var(--danger));
		}
	}
`

export const FormPasswordShow = styled.div`
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-40%);
	cursor: pointer;
`

export const Eye = styled(EyeFill)`
	color: rgba(var(--light), 0.5);
`

export const EyeSlash = styled(EyeSlashFill)`
	color: rgba(var(--light), 0.5);
`

export const ErrorMessage = styled.p`
	color: rgb(var(--danger));
	font-size: 0.6rem;
	position: absolute;
	left: 10px;
	bottom: -15px;
`

export const FormText = styled.p`
	font-size: 0.8rem;
	color: rgba(var(--light), 0.5);
`

export const FormLink = styled(Link)`
	color: rgb(var(--primary));
	text-decoration: none;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`
