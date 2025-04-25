import React from 'react'
import '../styles/Navbar.css'

export default function Navbar({ setSelectedShape, setShape, sendFlowBackend, setpressdelete }) {
    return (
        <>
            <nav className='h-[9vh] bg-[#f0f0f0] flex justify-between items-center pl-[2rem] pr-[4rem]'>
                <div className='flex gap-[1.5rem]'>
                    <strong>Select Shape : </strong>
                    <ul className='list-none flex gap-[3rem]'>
                        <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setShape("circle") }}>Circle</li>
                        <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setShape("rectangle") }}>Rectangle</li>
                        <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setShape("parallelogram") }}>Parallelogram</li>
                        <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setShape("diamond") }}>Diamond</li>
                        <li className=' text-green-600 cursor-pointer hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out ' onClick={() => { setSelectedShape(true); setShape("hexagon") }}>hexagon</li>
                    </ul>
                </div>
                <div className='flex gap-[2rem]'>
                    <button className='cursor-pointer text-blue-500 hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out'>Save Image</button>
                    <button onClick={()=> setpressdelete(true)} className='cursor-pointer text-blue-500 hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out'>Delete</button>
                    <button onClick={sendFlowBackend} className='cursor-pointer text-blue-500 hover:scale-[1.05] active:scale-[0.99] hover:transition-transform duration-300 ease-in-out'>🚀 Get Code</button>
                </div>
            </nav>
        </>
    )
}
