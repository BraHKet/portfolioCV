import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Admin from './pages/Admin'
import defaultData from './data/projects.json'
import './styles/global.css'
import { Analytics } from "@vercel/analytics/next"

const STORAGE_KEY = 'portfolio_data'

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // fall through to default
  }
  return defaultData
}

export default function App() {
  const [data, setData] = useState(loadData)

  return (
    <BrowserRouter>
      <Navbar profileName={data.profile.name} />
      <Routes>
        <Route path="/" element={<Home data={data} />} />
        <Route path="/projects/:id" element={<ProjectDetail data={data} />} />
        <Route path="/admin" element={<Admin data={data} onDataChange={setData} />} />
      </Routes>
    </BrowserRouter>
  )
}
