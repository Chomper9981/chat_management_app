import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header.jsx'

const LayOut = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> 
      </main>
    </>
  )
}

export default LayOut
