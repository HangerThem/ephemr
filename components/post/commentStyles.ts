import Link from "next/link"
import styled from "styled-components"

export const CommentContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  width: 450px;
  background-color: rgba(var(--light), 0.1);
  border-radius: 0.5rem;
`

export const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--light));
  text-decoration: none;
`

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const TimeStamp = styled.p`
  color: rgba(var(--light), 0.5);
`

export const CommentWrapper = styled.div`
  margin-bottom: 1rem;
`

export const PostContent = styled.div`
  a.hashtag,
  a.handle {
    color: rgba(var(--secondary), 0.8);
    transition: color 0.2s;

    &:hover {
      color: rgb(var(--secondary));
    }
  }
`

export const CommentActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
`

export const CommentAction = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  justify-content: center;
  color: rgba(var(--light));
  background-color: rgba(var(--light), 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 1.5rem;
  transition: background-color 0.2s;

  span {
    font-size: 0.75rem;
    text-align: center;

    &.presized {
      width: 1rem;
    }
  }

  &:hover {
    background-color: rgba(var(--light), 0.2);
  }
`

export const CommentEditor = styled.textarea`
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
  height: 100px;
`

export const CommentEditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(var(--light), 0.1);
    color: rgb(var(--light));
    border: none;
    border-radius: 1rem;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.75rem;
    font-family: inherit;

    &:hover {
      background-color: rgba(var(--light), 0.3);
    }

    &.cancel {
      background-color: rgba(var(--danger), 0.5);

      &:hover {
        background-color: rgb(var(--danger));
      }
    }
  }
`
