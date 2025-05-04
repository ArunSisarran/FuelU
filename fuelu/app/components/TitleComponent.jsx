"use client"

import React from 'react'

const TitleComponent = () => {
    return (
        <div className="py-12 text-center relative">
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-green-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent animate-gradient bg-300% relative">
                        FuelU
                        <span className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-green-400/20 blur-lg" />
                    </span>
                </h1>
                
                <div className="w-32 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full" />
                
                <p className="text-xl md:text-2xl text-slate-300 mt-6 font-light tracking-wide">
                    Fueling Your Health and Success in College
                </p>
            </div>
        </div>
    )
}

export default TitleComponent
