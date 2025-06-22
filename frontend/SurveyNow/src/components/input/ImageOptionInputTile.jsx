import React from 'react';

const ImageOptionInputTile = ({ isSelected, imgUrl, onSelect, label = '' }) => {
  const selectedClasses = isSelected
    ? 'border-2 border-green-600 ring-2 ring-green-300'
    : 'border border-transparent hover:border-green-400 hover:shadow-sm';

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full flex flex-col items-center bg-slate-100 rounded-md overflow-hidden transition-all duration-200 focus:outline-none ${selectedClasses}`}
    >
      <img
        src={imgUrl}
        alt={label || 'Poll option'}
        className="w-full h-36 object-contain bg-white "
      />
      {label && (
        <div className="w-full px-2 py-1 text-sm text-gray-700 text-center bg-white">
          {/* {label} */}
        </div>
      )}
    </button>
  );
};

export default ImageOptionInputTile;
