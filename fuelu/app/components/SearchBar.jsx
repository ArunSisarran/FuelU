"use client"
import React, { useState } from 'react'

const SearchBar = ({onSearch}) =>{
    const [searchValue, setSearchValue] = useState('')

    const handleInputChange = (e) =>{
        setSearchValue(e.target.value)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log('Search Submitted: ', searchValue)
        onSearch(searchValue)
    }
    return(
        <form className='w-[600px] relative' onSubmit={handleSubmit}>
            <div className="relative">
                <input 
                    type="search" 
                    placeholder='What food would you like?' 
                    className='w-full p-6 rounded-full bg-[#3e2e28]/80 border border-[#d1b2a1]/30 text-[#e9ded8] placeholder-[#d1b2a1]/70 focus:outline-none focus:border-[#d1b2a1] focus:ring-2 focus:ring-[#d1b2a1]/20 transition-all'
                    value={searchValue}
                    onChange={handleInputChange}
                />
                <button 
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#d1b2a1] hover:bg-[#c19f8e] text-[#3e2e28] font-semibold px-6 py-3 rounded-full cursor-pointer z-10 transition-all"
                >
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchBar
