"use client"

import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: 52, 152, 219;
    --secondary: 46, 204, 113;
    --background: 12, 12, 17;
    --danger: 231, 76, 60;
    --warning: 243, 156, 18;
    --success: 39, 174, 96;
    --info: 52, 152, 219;
    --dark: 33, 33, 33;
    --light: 255, 255, 255;
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--primary)) rgb(var(--dark));
  }

  body {
    background-color: rgb(var(--background));
    color: rgb(var(--light));
    min-height: 100vh;
  }

  a {
    color: rgb(var(--primary));
    text-decoration: none;
  }

  input {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(var(--dark));
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--primary));
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--secondary));
  }

  ::-webkit-scrollbar-thumb:active {
    background: rgb(var(--info));
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  ::-webkit-resizer {
    background: transparent;
  }

  ::selection {
    background-color: rgb(var(--primary));
    color: rgb(var(--light));
  }
`

export const WithNavContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 7fr;
  grid-template-rows: 100%;
`
