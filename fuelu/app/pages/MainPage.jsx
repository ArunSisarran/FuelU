"use client"
import React, { useState, useEffect } from 'react'
import SearchBar from "../components/SearchBar";
import TitleComponent from '../components/TitleComponent';
import ImageCard from '../components/ImageCard';

export default function MainPage(){
    const [searchValue, setSearchValue] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [foodItems, setFoodItems] = useState([])
    const [filteredItems, setFilteredItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [slideDirection, setSlideDirection] = useState('none')
    const [displayItems, setDisplayItems] = useState([])
    const [nextItems, setNextItems] = useState([])
    const itemsPerPage = 3
    
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
                const categoriesData = await categoriesResponse.json()
                
                const allMeals = []
                const categoriesToFetch = categoriesData.categories.slice(0, 3)
                
                for (const category of categoriesToFetch) {
                    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`)
                    const data = await response.json()
                    allMeals.push(...data.meals.slice(0, 3))
                }
                
                const transformedMeals = allMeals.map(meal => ({
                    id: meal.idMeal,
                    name: meal.strMeal,
                    image: meal.strMealThumb,
                    alt: meal.strMeal
                }))
                
                setFoodItems(transformedMeals)
                setFilteredItems(transformedMeals)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching meals:', err)
                setError('Failed to load meals. Please try again later.')
                setLoading(false)
            }
        }
        
        fetchMeals()
    }, [])

    useEffect(() => {
        setDisplayItems(filteredItems.slice(currentIndex, currentIndex + itemsPerPage));
    }, [filteredItems, currentIndex, itemsPerPage]);

    const handleSearch = async (query) => {
        setSearchValue(query)
        console.log("Main page received search: ", query)
        
        if (!query.trim()) {
            setFilteredItems(foodItems)
            setCurrentIndex(0)
            return
        }
        
        try {
            setLoading(true)
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
            const data = await response.json()
            
            if (data.meals) {
                const searchResults = data.meals.map(meal => ({
                    id: meal.idMeal,
                    name: meal.strMeal,
                    image: meal.strMealThumb,
                    alt: meal.strMeal
                }))
                setFilteredItems(searchResults)
            } else {
                setFilteredItems([])
            }
            setCurrentIndex(0)
            setLoading(false)
        } catch (err) {
            console.error('Error searching meals:', err)
            setError('Failed to search meals. Please try again.')
            setLoading(false)
        }
    }

    const handleCardClick = (item) => {
        console.log("Card clicked:", item.name)
    }

    const handlePrevious = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setSlideDirection('left');
        
        const nextIndex = currentIndex === 0 
            ? Math.max(0, Math.ceil(filteredItems.length / itemsPerPage) - 1) * itemsPerPage 
            : currentIndex - itemsPerPage;
        
        setNextItems(filteredItems.slice(nextIndex, nextIndex + itemsPerPage));
        
        setTimeout(() => {
            setCurrentIndex(nextIndex);
            setDisplayItems(filteredItems.slice(nextIndex, nextIndex + itemsPerPage));
            setNextItems([]);
            setIsAnimating(false);
            setSlideDirection('none');
        }, 500);
    }

    const handleNext = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setSlideDirection('right');
        
        const nextIndex = currentIndex + itemsPerPage >= filteredItems.length 
            ? 0 
            : currentIndex + itemsPerPage;
        
        setNextItems(filteredItems.slice(nextIndex, nextIndex + itemsPerPage));
        
        setTimeout(() => {
            setCurrentIndex(nextIndex);
            setDisplayItems(filteredItems.slice(nextIndex, nextIndex + itemsPerPage));
            setNextItems([]);
            setIsAnimating(false);
            setSlideDirection('none');
        }, 500);
    }

    return(
    <div className='flex flex-col items-center w-full'>
        <TitleComponent />
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch}/>
            <div className="mt-8 w-full relative max-w-5xl px-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center text-slate-400">No meals found. Try a different search.</div>
                ) : (
                    <>
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
                        <div className="relative overflow-hidden h-[300px]">
                            {/* Current items sliding out */}
                            <div 
                                className={`absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-6 transform
                                    ${isAnimating ? 'transition-all duration-500 ease-in-out' : ''}
                                    ${isAnimating && slideDirection === 'left' ? 'translate-x-full opacity-0' : ''}
                                    ${isAnimating && slideDirection === 'right' ? '-translate-x-full opacity-0' : ''}
                                    ${!isAnimating ? 'translate-x-0 opacity-100' : ''}
                                `}
                            >
                                {displayItems.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="transform transition-all duration-300"
                                    >
                                        <ImageCard 
                                            src={item.image} 
                                            alt={item.alt} 
                                            name={item.name} 
                                            onClick={() => handleCardClick(item)}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Next items sliding in */}
                            {isAnimating && (
                                <div 
                                    className={`absolute inset-0 grid grid-cols-1 md:grid-cols-3 gap-6 transform
                                        ${slideDirection === 'left' ? 'animate-slide-in-from-left' : ''}
                                        ${slideDirection === 'right' ? 'animate-slide-in-from-right' : ''}
                                    `}
                                >
                                    {nextItems.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="transform transition-all duration-300"
                                        >
                                            <ImageCard 
                                                src={item.image} 
                                                alt={item.alt} 
                                                name={item.name} 
                                                onClick={() => handleCardClick(item)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
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
                    </>
                )}
            </div>
        </div>
    </div>
    )
}
