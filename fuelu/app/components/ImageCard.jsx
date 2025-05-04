import React, { useState, useEffect } from 'react';

const ImageCard = ({ src, alt, name, mealId, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mealDetails, setMealDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFlipped && !mealDetails && !isLoading) {
      setIsLoading(true);
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
          if (data.meals && data.meals[0]) {
            setMealDetails(data.meals[0]);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching meal details:', error);
          setIsLoading(false);
        });
    }
  }, [isFlipped, mealId, mealDetails, isLoading]);

  const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s'
        }}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="overflow-hidden rounded-lg shadow-md h-full flex flex-col">
            <div className="flex-grow relative">
              <img 
                src={src} 
                alt={alt || name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-slate-800/90">
              <h3 className="text-lg font-medium text-center">{name}</h3>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 rounded-lg shadow-md overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : mealDetails ? (
            <div className="flex flex-col h-full p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-400 mb-2">{name}</h3>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="bg-slate-700 px-3 py-1 rounded-full">{mealDetails.strArea}</span>
                  <span className="bg-slate-700 px-3 py-1 rounded-full">{mealDetails.strCategory}</span>
                </div>
              </div>
              
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-gray-300 mb-4">Ingredients:</h4>
                <div className="grid grid-cols-1 gap-2 max-h-[192px] overflow-y-auto custom-scrollbar pr-2">
                  {getIngredients(mealDetails).map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center bg-slate-700/50 px-3 py-2 rounded"
                    >
                      <span className="text-white">{item.ingredient}</span>
                      <span className="text-green-400 text-sm">{item.measure}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors">
                  View Full Recipe
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-400">No details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
