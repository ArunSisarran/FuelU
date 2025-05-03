import React from 'react';

const ImageCard = ({ src, alt, name, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center max-w-xs cursor-pointer transform transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-lg shadow-md">
        <img 
          src={src} 
          alt={alt || name} 
          className="w-full h-88 object-cover"
        />
      </div>
      <h3 className="mt-3 text-lg font-medium text-center">{name}</h3>
    </div>
  );
};

export default ImageCard;
