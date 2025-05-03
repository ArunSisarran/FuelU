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
                    placeholder='Search meals or cuisine (e.g., "Pasta" or "Canadian)' 
                    className='w-full p-6 rounded-full bg-slate-800'
                    value={searchValue}
                    onChange={handleInputChange}
                />
                <button 
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-full cursor-pointer z-10"
                >
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchBar
