"use client"
import React, { useState } from 'react'
import SearchBar from "../components/SearchBar";
import TitleComponent from '../components/TitleComponent';
import ImageCard from '../components/ImageCard';

export default function MainPage(){
    const [searchValue, setSearchValue] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerPage = 3
    
    const foodItems = [
        {
            id: 1,
            name: "Margherita Pizza",
            image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Delicious Margherita pizza with tomatoes and basil"
        },
        {
            id: 2,
            name: "Spaghetti Carbonara",
            image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Creamy Spaghetti Carbonara with bacon and parmesan"
        },
        {
            id: 3,
            name: "Mediterranean Salad",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Fresh Mediterranean Salad with feta cheese and olives"
        },
        {
            id: 4,
            name: "Chicken Tikka Masala",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Spicy Chicken Tikka Masala with rice"
        },
        {
            id: 5,
            name: "Beef Burger",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Juicy beef burger with cheese and vegetables"
        },
        {
            id: 6,
            name: "Chocolate Cake",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Rich chocolate cake with frosting"
        },
        {
            id: 7,
            name: "Avocado Toast",
            image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Healthy avocado toast with eggs"
        },
        {
            id: 8,
            name: "Salmon Sushi",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Fresh salmon sushi rolls"
        },
        {
            id: 9,
            name: "Fruit Smoothie",
            image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            alt: "Refreshing fruit smoothie with berries"
        }
    ]

    const handleSearch = (query) => {
        setSearchValue(query)
        console.log("Main page received search: ", query)
    }

    const handleCardClick = (item) => {
        console.log("Card clicked:", item.name)
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return Math.max(0, Math.ceil(foodItems.length / itemsPerPage) - 1) * itemsPerPage;
            }
            return Math.max(0, prevIndex - itemsPerPage);
        });
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex + itemsPerPage >= foodItems.length) {
                return 0;
            }
            return prevIndex + itemsPerPage;
        });
    }

    const currentItems = foodItems.slice(currentIndex, currentIndex + itemsPerPage);

    return(
    <div className='flex flex-col items-center w-full'>
        <TitleComponent />
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch}/>
            <div className="mt-8 w-full relative max-w-5xl px-16">
                {/*This is the left arrow*/}
                <button 
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Previous items"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                {/*This is the div that holds the food*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
                    {currentItems.map((item) => (
                        <ImageCard 
                            key={item.id}
                            src={item.image} 
                            alt={item.alt} 
                            name={item.name} 
                            onClick={() => handleCardClick(item)}
                        />
                    ))}
                </div>
                
                {/*This is the right arrow*/}
                <button 
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Next items"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/*This shows what page your on*/}
                <div className="flex justify-center mt-6">
                    {Array.from({ length: Math.ceil(foodItems.length / itemsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index * itemsPerPage)}
                            className={`mx-1 w-3 h-3 rounded-full transition-all ${
                                index === Math.floor(currentIndex / itemsPerPage) 
                                    ? 'bg-green-500 scale-125' 
                                    : 'bg-slate-400'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
    )
}
