import React from 'react';

const ImageCard = ({ src, alt, name, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center w-full cursor-pointer transform transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg shadow-lg w-full aspect-3/4">
        <img 
          src={src} 
          alt={alt || name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-center px-2">{name}</h3>
    </div>
  );
};

export default ImageCard;
