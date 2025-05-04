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
    const [availableAreas, setAvailableAreas] = useState([])
    const itemsPerPage = 4
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const currentPage = Math.floor(currentIndex / itemsPerPage)
    
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true)
                
                const areasResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
                const areasData = await areasResponse.json()
                if (areasData.meals) {
                    const areas = areasData.meals.map(meal => meal.strArea)
                    setAvailableAreas(areas)
                }
                
                const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
                const categoriesData = await categoriesResponse.json()
                
                const allMeals = []
                const categoriesToFetch = categoriesData.categories.slice(0, 8)
                
                for (const category of categoriesToFetch) {
                    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`)
                    const data = await response.json()
                    allMeals.push(...data.meals)
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
        
        fetchInitialData()
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
            
            const queryLower = query.toLowerCase();
            const matchedArea = availableAreas.find(area => area.toLowerCase() === queryLower);
            
            let data;
            if (matchedArea) {
                console.log("Searching by area:", matchedArea)
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${matchedArea}`)
                data = await response.json()
            } else {
                console.log("Searching by meal name:", query)
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
                data = await response.json()
            }
            
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

    const goToPage = (pageIndex) => {
        if (isAnimating || pageIndex === currentPage) return;
        
        const newIndex = pageIndex * itemsPerPage;
        
        if (newIndex > currentIndex) {
            setSlideDirection('right');
        } else {
            setSlideDirection('left');
        }
        
        setIsAnimating(true);
        setNextItems(filteredItems.slice(newIndex, newIndex + itemsPerPage));
        
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setDisplayItems(filteredItems.slice(newIndex, newIndex + itemsPerPage));
            setNextItems([]);
            setIsAnimating(false);
            setSlideDirection('none');
        }, 500);
    }

    const PageIndicator = () => {
        const maxVisibleDots = 4;
        const halfRange = Math.floor(maxVisibleDots / 2);
        
        let startDot = Math.max(0, currentPage - halfRange);
        let endDot = Math.min(totalPages - 1, currentPage + halfRange);
        
        if (currentPage <= halfRange) {
            endDot = Math.min(maxVisibleDots - 1, totalPages - 1);
        } else if (currentPage >= totalPages - halfRange - 1) {
            startDot = Math.max(0, totalPages - maxVisibleDots);
        }
        
        return (
            <div className="relative w-full mt-8">
                {/* Dots*/}
                <div className="flex justify-center items-center mb-6">
                    {startDot > 0 && (
                        <>
                            <button
                                onClick={() => goToPage(0)}
                                className="group relative mx-1"
                                aria-label="Go to page 1"
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-all duration-300" />
                                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-base text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1</span>
                            </button>
                            {startDot > 1 && (
                                <span className="mx-1 text-slate-600">···</span>
                            )}
                        </>
                    )}
                    
                    {/* Visible dots */}
                    {Array.from({ length: endDot - startDot + 1 }).map((_, idx) => {
                        const pageIndex = startDot + idx;
                        const isActive = pageIndex === currentPage;
                        
                        return (
                            <button
                                key={pageIndex}
                                onClick={() => goToPage(pageIndex)}
                                className={`group relative mx-1.5 transition-all duration-300`}
                                aria-label={`Go to page ${pageIndex + 1}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {isActive ? (
                                    <div className="relative">
                                        {/* Pulsing ring for active dot */}
                                        <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-20" />
                                        <div className="w-5 h-5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                                    </div>
                                ) : (
                                    <div className={`rounded-full bg-slate-600 hover:bg-slate-400 transition-all duration-300
                                        ${Math.abs(pageIndex - currentPage) <= 1 ? 'w-2.5 h-2.5' : 'w-2 h-2'}`} 
                                    />
                                )}
                                {/* Page number*/}
                                <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-base 
                                    ${isActive ? 'text-green-400 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'} 
                                    transition-opacity`}>
                                    {pageIndex + 1}
                                </span>
                            </button>
                        );
                    })}
                    
                    {endDot < totalPages - 1 && (
                        <>
                            {endDot < totalPages - 2 && (
                                <span className="mx-1 text-slate-600">···</span>
                            )}
                            <button
                                onClick={() => goToPage(totalPages - 1)}
                                className="group relative mx-1"
                                aria-label={`Go to page ${totalPages}`}
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-all duration-300" />
                                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-base text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{totalPages}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return(
    <div className='flex flex-col items-center w-full'>
        <TitleComponent />
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch}/>
            
            {/* Available areas hint */}
            <div className="mt-4 text-center">
                <p className="text-slate-400 text-sm">Try searching by cuisine: Canadian, Italian, Chinese, Mexican, Indian, and more!</p>
            </div>
            <div className="mt-8 w-full relative max-w-7lg px-16">
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
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous items"
                            disabled={currentPage === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {/*This is the div that holds the food*/}
                        <div className="relative overflow-hidden h-[500px]">
                            {/* Current items sliding out */}
                            <div 
                                className={`absolute inset-0 grid grid-cols-1 md:grid-cols-4 gap-8 transform
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
                                            mealId={item.id}
                                            onClick={() => handleCardClick(item)}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Next items sliding in */}
                            {isAnimating && (
                                <div 
                                    className={`absolute inset-0 grid grid-cols-1 md:grid-cols-4 gap-8 transform
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
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next items"
                            disabled={currentPage === totalPages - 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/*page indicator */}
                        {PageIndicator()}
                    </>
                )}
            </div>
        </div>
    </div>
    )
}
