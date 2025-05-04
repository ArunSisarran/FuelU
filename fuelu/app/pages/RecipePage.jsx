"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (error || !mealDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 text-xl mb-4">{error || 'Something went wrong'}</p>
                <button 
                    onClick={() => router.back()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-6 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to search
                </button>

                {/* Title and categories */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        {mealDetails.strMeal}
                    </h1>
                    <div className="flex justify-center gap-4">
                        <span className="bg-slate-700 px-4 py-2 rounded-full text-sm">
                            {mealDetails.strArea} Cuisine
                        </span>
                        <span className="bg-slate-700 px-4 py-2 rounded-full text-sm">
                            {mealDetails.strCategory}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left column - Image and ingredients */}
                    <div>
                        {/* Meal image */}
                        <div className="rounded-lg overflow-hidden shadow-xl mb-6">
                            <img 
                                src={mealDetails.strMealThumb} 
                                alt={mealDetails.strMeal}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Ingredients */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-green-400">Ingredients</h2>
                            <div className="space-y-3">
                                {getIngredients(mealDetails).map((item, index) => (
                                    <div 
                                        key={index}
                                        className="flex justify-between items-center bg-slate-700/50 px-4 py-3 rounded-lg"
                                    >
                                        <span className="text-lg">{item.ingredient}</span>
                                        <span className="text-green-400 font-medium">{item.measure}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Instructions */}
                    <div className="bg-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Instructions</h2>
                        <div className="space-y-4">
                            {formatInstructions(mealDetails.strInstructions).map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <p className="text-lg leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional information */}
                {(mealDetails.strYoutube || mealDetails.strSource || mealDetails.strTags) && (
                    <div className="mt-8 bg-slate-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Additional Information</h2>
                        <div className="space-y-4">
                            {mealDetails.strYoutube && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Video Tutorial</h3>
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
                                    <h3 className="text-lg font-semibold mb-2">Recipe Source</h3>
                                    <a 
                                        href={mealDetails.strSource}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
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
                                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {mealDetails.strTags.split(',').map((tag, index) => (
                                            <span 
                                                key={index}
                                                className="bg-slate-700 px-3 py-1 rounded-full text-sm"
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
    )
}

export default RecipePage
