"use client"

import styled from "styled-components"
import { Search } from "react-bootstrap-icons"
import { useRef, useState } from "react"
import { requestSearchUsers } from "@/services/api-services/searchService"
import { isError } from "@/utils/isError"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Avatar from "@/components/avatar"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid rgba(var(--light), 0.1);
  background-color: rgba(var(--light), 0.1);
  width: 600px;
  padding: 0.5rem;
  transition: border 0.2s;

  &.active {
    border-radius: 1rem 1rem 0 0;
    border: 1px solid rgba(var(--light), 0.2);
  }
`

const SearchIcon = styled(Search)`
  color: rgba(var(--light));
  cursor: pointer;
`

const Input = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  margin-left: 0.5rem;
  color: rgba(var(--light));
  font-size: 0.875rem;
  width: 100%;
`

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  width: 100%;
  max-width: 600px;
  background-color: rgba(var(--dark));
  border-radius: 0 0 1rem 1rem;
  border: 1px solid rgba(var(--light), 0.2);
  border-top: none;
  overflow: hidden;
`

const SerachResult = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  color: rgba(var(--light));
  width: 100%;

  &:hover {
    background-color: rgba(var(--light), 0.1);
  }
`

const SerachNoResult = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
`

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1rem;
    font-weight: 500;
  }

  p {
    font-size: 0.75rem;
    color: rgba(var(--light), 0.5);
  }
`

const SearchBar = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchResult, setSearchResult] = useState<IUserSimple[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (query: string) => {
    const response = await requestSearchUsers(query)

    if (isError(response)) {
      return
    }

    setSearchResult(response.users)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?q=${searchQuery}`)
    inputRef.current?.blur()
    setSearchOpen(false)
  }

  if (typeof window !== "undefined") {
    window.addEventListener("click", (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    })

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false)
      }
    })
  }

  return (
    <Container ref={searchRef}>
      <SearchContainer
        onClick={() => {
          setSearchOpen(true)
          inputRef.current?.focus()
          handleSearch(searchQuery)
        }}
        className={searchOpen && searchResult ? "active" : ""}
      >
        <SearchIcon
          onClick={(e) => {
            e.stopPropagation()
            if (searchOpen) {
              inputRef.current?.blur()
              setSearchOpen(false)
            } else {
              setSearchOpen(true)
              inputRef.current?.focus()
            }
          }}
        />
        <form onSubmit={handleSubmit}>
          <Input
            name="q"
            autoComplete="off"
            type="text"
            placeholder="Search"
            ref={inputRef}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
          />
        </form>
      </SearchContainer>
      {searchOpen && searchResult && (
        <SearchResults>
          {searchResult.length > 0 ? (
            searchResult.map((user) => (
              <SerachResult
                key={user.id}
                href={`/${user.username}`}
                passHref
                onClick={() => setSearchOpen(false)}
              >
                <Avatar
                  seed={user.displayName}
                  src={user.profilePic}
                  size={30}
                  online={user.online}
                />
                <ProfileWrapper>
                  <h3>{user.displayName}</h3>
                  <p>@{user.username}</p>
                </ProfileWrapper>
              </SerachResult>
            ))
          ) : (
            <SerachNoResult>
              <p>No results found</p>
            </SerachNoResult>
          )}
        </SearchResults>
      )}
    </Container>
  )
}

export default SearchBar
