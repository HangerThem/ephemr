"use client"

import { FC } from "react"
import styled from "styled-components"

const SwitchContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const SwitchLabel = styled.label`
	display: flex;
	align-items: center;
`

const SwitchInput = styled.input`
	display: none;
`

const SwitchSlider = styled.div`
	position: relative;
	width: 40px;
	height: 20px;
	background-color: rgb(var(--dark));
	border-radius: 100px;
	transition: background-color 0.3s;
`

const SwitchCircle = styled.div`
	position: absolute;
	top: 2px;
	left: 2px;
	width: 16px;
	height: 16px;
	background-color: rgb(var(--light));
	border-radius: 50%;
	transition: transform 0.3s;
`

const SwitchInputChecked = styled(SwitchInput)`
	&:checked + ${SwitchSlider} {
		background-color: rgb(var(--primary));
	}

	&:checked + ${SwitchSlider} ${SwitchCircle} {
		transform: translateX(20px);
	}
`

interface SwitchProps {
	checked: boolean
	onChange: () => void
}

const Switch: FC<SwitchProps> = ({ checked, onChange }) => (
	<SwitchContainer>
		<SwitchLabel>
			<SwitchInputChecked
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			<SwitchSlider>
				<SwitchCircle />
			</SwitchSlider>
		</SwitchLabel>
	</SwitchContainer>
)

export default Switch
