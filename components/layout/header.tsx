"use client"

import styled from "styled-components"
import SearchBar from "../search/searchBar"
import { useAuth } from "@/context/authContext"
import ProfileTab from "@/components/profile/profileTab"

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(var(--light), 0.1);
  width: 100%;
  position: sticky;
  background-color: rgb(var(--background));
  top: 0;
  z-index: 100;
  margin-bottom: 1rem;
`

const Spacer = styled.div`
  flex: 1;
`

const Header = () => {
  const { user } = useAuth()
  return (
    <HeaderContainer>
      {user && <ProfileTab />}
      <SearchBar />
      {user && <Spacer />}
    </HeaderContainer>
  )
}

export default Header
