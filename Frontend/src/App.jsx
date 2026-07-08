import { useState } from 'react'
import './App.css'
import Authpage from './Pages/AuthPage/Authpage'
import { Toaster } from "react-hot-toast";

function App() {


  return (
    <>
      <Toaster position="top-center" />
      <Authpage />
    </>
  )
}

export default App
