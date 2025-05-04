"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

const RecipePage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const mealId = searchParams.get('id')
    
    const [mealDetails, setMealDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMealDetails = async () => {
            if (!mealId) {
                setError('No meal ID provided')
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
                const data = await response.json()
                
                if (data.meals && data.meals[0]) {
                    setMealDetails(data.meals[0])
                } else {
                    setError('Meal not found')
                }
            } catch (err) {
                console.error('Error fetching meal details:', err)
                setError('Failed to load meal details')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMealDetails()
    }, [mealId])

    const getIngredients = (meal) => {
        const ingredients = []
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                })
            }
        }
        return ingredients
    }

    const formatInstructions = (instructions) => {
        if (!instructions) return []
        return instructions
            .split(/(?:\.\s+|\n|(?:^|\n)\d+\.\s*)/)
            .filter(step => step.trim().length > 0)
            .map(step => step.trim())
    }

    if (isLoading) {
        return (
            <div className="relative min-h-screen">
                {/* Background Image */}
                <Image
                    src="/assets/no2.jpg"
                    alt="Background image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                    className="fixed inset-0 z-0"
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#d1b2a1]"></div>
                </div>
            </div>
        )
    }

    if (error || !mealDetails) {
        return (
            <div className="relative min-h-screen">
                {/* Background Image */}
                <Image
                    src="/assets/no2.jpg"
                    alt="Background image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                    className="fixed inset-0 z-0"
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
                    <p className="text-red-400 text-xl mb-4">{error || 'Something went wrong'}</p>
                    <button 
                        onClick={() => router.back()}
                        className="bg-[#d1b2a1] hover:bg-[#c19f8e] text-[#3e2e28] px-6 py-2 rounded-full font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <Image
                src="/assets/no2.jpg"
                alt="Background image"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
                className="fixed inset-0 z-0"
            />
            
            {/* Content */}
            <div className="relative z-10">
                <div className="absolute inset-0 bg-black/50 z-0" />
                
                <div className="relative z-20 min-h-screen text-[#e9ded8] p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Back button */}
                        <button 
                            onClick={() => router.back()}
                            className="mb-6 bg-[#3e2e28]/90 border border-[#d1b2a1]/30 hover:bg-[#3e2e28] hover:border-[#d1b2a1]/50 text-[#d1b2a1] px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to search
                        </button>

                        {/* Title and categories */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#d1b2a1] to-[#e9ded8] bg-clip-text text-transparent">
                                {mealDetails.strMeal}
                            </h1>
                            <div className="flex justify-center gap-4">
                                <span className="bg-[#3e2e28]/80 px-4 py-2 rounded-full text-sm border border-[#d1b2a1]/20">
                                    {mealDetails.strArea} Cuisine
                                </span>
                                <span className="bg-[#3e2e28]/80 px-4 py-2 rounded-full text-sm border border-[#d1b2a1]/20">
                                    {mealDetails.strCategory}
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left column - Image and ingredients */}
                            <div>
                                {/* Meal image */}
                                <div className="rounded-lg overflow-hidden shadow-xl mb-6 border border-[#d1b2a1]/20">
                                    <img 
                                        src={mealDetails.strMealThumb} 
                                        alt={mealDetails.strMeal}
                                        className="w-full h-auto"
                                    />
                                </div>

                                {/* Ingredients */}
                                <div className="bg-[#3e2e28]/90 backdrop-blur-sm border border-[#d1b2a1]/20 rounded-lg p-6">
                                    <h2 className="text-2xl font-bold mb-4 text-[#d1b2a1]">Ingredients</h2>
                                    <div className="space-y-3">
                                        {getIngredients(mealDetails).map((item, index) => (
                                            <div 
                                                key={index}
                                                className="flex justify-between items-center bg-[#d1b2a1]/10 px-4 py-3 rounded-lg"
                                            >
                                                <span className="text-lg text-[#e9ded8]">{item.ingredient}</span>
                                                <span className="text-[#d1b2a1] font-medium">{item.measure}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right column - Instructions */}
                            <div className="bg-[#3e2e28]/90 backdrop-blur-sm border border-[#d1b2a1]/20 rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-4 text-[#d1b2a1]">Instructions</h2>
                                <div className="space-y-4">
                                    {formatInstructions(mealDetails.strInstructions).map((step, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 bg-[#d1b2a1] rounded-full flex items-center justify-center font-bold text-[#3e2e28]">
                                                {index + 1}
                                            </div>
                                            <p className="text-lg leading-relaxed text-[#e9ded8]">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional information */}
                        {(mealDetails.strYoutube || mealDetails.strSource || mealDetails.strTags) && (
                            <div className="mt-8 bg-[#3e2e28]/90 backdrop-blur-sm border border-[#d1b2a1]/20 rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-4 text-[#d1b2a1]">Additional Information</h2>
                                <div className="space-y-4">
                                    {mealDetails.strYoutube && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-[#e9ded8]">Video Tutorial</h3>
                                            <a 
                                                href={mealDetails.strYoutube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                                </svg>
                                                Watch on YouTube
                                            </a>
                                        </div>
                                    )}
                                    
                                    {mealDetails.strSource && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-[#e9ded8]">Recipe Source</h3>
                                            <a 
                                                href={mealDetails.strSource}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-[#d1b2a1] hover:bg-[#c19f8e] text-[#3e2e28] px-4 py-2 rounded-full transition-colors font-semibold"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                View Original Recipe
                                            </a>
                                        </div>
                                    )}
                                    
                                    {mealDetails.strTags && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-[#e9ded8]">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {mealDetails.strTags.split(',').map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="bg-[#3e2e28]/80 px-3 py-1 rounded-full text-sm border border-[#d1b2a1]/20"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipePage
