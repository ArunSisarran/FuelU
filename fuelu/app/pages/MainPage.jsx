"use client"
import React, { useState } from 'react'
import SearchBar from "../components/SearchBar";
import TitleComponent from '../components/TitleComponent';


export default function MainPage(){
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (query) =>{
        setSearchValue(query)
        console.log("Main page recieved search: ", query)
    }

    return(
    <div className='flex flex-col items-center w-full'>
        <TitleComponent />
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch}/>
        </div>
    </div>
    )
}
