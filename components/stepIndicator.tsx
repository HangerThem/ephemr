"use client"

import styled from "styled-components"
import { useRegisterContext } from "@/context/registerContext"
import { CheckLg } from "react-bootstrap-icons"

const IndicatorContainer = styled.div<{ $step: number; $total: number }>`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: absolute;
  top: 0;
  gap: 40px;

  &::before {
    content: "";
    position: absolute;
    top: 19px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: linear-gradient(
      to right,
      rgb(var(--primary)) 0%,
      rgb(var(--primary))
        calc(${({ $step, $total }) => ($step - 1) * (100 / ($total - 1))}%),
      rgba(var(--light), 0.1)
        calc(${({ $step, $total }) => ($step - 1) * (100 / ($total - 1))}%),
      rgba(var(--light), 0.1) 100%
    );
    z-index: -1;
  }
`

const IndicatorDot = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgb(var(--dark));
  color: rgb(var(--light));
  font-weight: 500;
  transition: background-color 0.2s ease;
  border: 5px solid rgb(var(--background));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active,
  &.done {
    background-color: rgb(var(--primary));
  }
`

const IndicatorText = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(var(--light), 0.4);

  &.active,
  &.done {
    color: rgb(var(--light));
  }
`

const IndicatorItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const StepIndicator = () => {
  const { step } = useRegisterContext()

  return (
    <IndicatorContainer $step={step} $total={3}>
      <IndicatorItem>
        <IndicatorDot
          className={step === 1 ? "active" : step > 1 ? "done" : ""}
        >
          {step > 1 ? <CheckLg /> : "1"}
        </IndicatorDot>
        <IndicatorText
          className={step === 1 ? "active" : step > 1 ? "done" : ""}
        >
          Basic Info
        </IndicatorText>
      </IndicatorItem>
      <IndicatorItem>
        <IndicatorDot
          className={step === 2 ? "active" : step > 2 ? "done" : ""}
        >
          {step > 2 ? <CheckLg /> : "2"}
        </IndicatorDot>
        <IndicatorText
          className={step === 2 ? "active" : step > 2 ? "done" : ""}
        >
          Verification
        </IndicatorText>
      </IndicatorItem>
      <IndicatorItem>
        <IndicatorDot
          className={step === 3 ? "active" : step > 3 ? "done" : ""}
        >
          {step > 3 ? <CheckLg /> : "3"}
        </IndicatorDot>
        <IndicatorText
          className={step === 3 ? "active" : step > 3 ? "done" : ""}
        >
          Details
        </IndicatorText>
      </IndicatorItem>
    </IndicatorContainer>
  )
}

export default StepIndicator
