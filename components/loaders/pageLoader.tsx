"use client"

import styled from "styled-components"

const Loader = styled.div`
  border: 8px solid rgba(var(--primary), 0.1);
  border-top: 8px solid rgb(var(--primary));
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.625s ease-in infinite;
  z-index: 100;
  position: absolute;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  z-index: 100;
  width: 100%;

  &.full {
    position: fixed;
    background-color: rgb(var(--dark));
  }
`

interface IPageLoaderProps {
  className?: string
}
const PageLoader = ({ className }: IPageLoaderProps) => (
  <LoaderContainer className={className}>
    <Loader />
  </LoaderContainer>
)

export default PageLoader
