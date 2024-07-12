import Link from "next/link"
import styled from "styled-components"

const ButtonWrapper = styled.button`
  color: rgb(var(--light));
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  width: 100%;
  background-color: rgba(var(--light), 0.1);
  border: 1px solid rgba(var(--light), 0.2);

  &.danger {
    background-color: rgba(var(--danger), 0.6);

    &:hover {
      background-color: rgba(var(--danger), 0.8);
    }
  }

  &.small {
    width: 75px;
  }

  &.medium {
    width: 100px;
  }

  &.large {
    width: 150px;
  }

  &.full {
    width: 100%;
  }

  &:hover {
    background-color: rgba(var(--light), 0.2);
  }
`

interface ButtonProps {
  children: React.ReactNode
  size?: "small" | "medium" | "large" | "full"
  type?: "button" | "submit" | "reset"
  className?: string
  link?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export default function Button({
  children,
  size = "medium",
  type = "button",
  className,
  icon,
  link,
  onClick,
}: ButtonProps) {
  if (link) {
    return (
      <Link href={link}>
        <ButtonWrapper
          className={className + " " + size}
          type={type}
          onClick={onClick}
        >
          {icon} {children}
        </ButtonWrapper>
      </Link>
    )
  }

  return (
    <ButtonWrapper
      className={className + " " + size}
      type={type}
      onClick={onClick}
    >
      {icon} {children}
    </ButtonWrapper>
  )
}
