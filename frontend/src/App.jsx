import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Projectpage from "./components/Projectpage.jsx"

function ProjectPage(){
  return (
    <>
      <Projectpage/>
    </>
  )
}

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProjectPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
