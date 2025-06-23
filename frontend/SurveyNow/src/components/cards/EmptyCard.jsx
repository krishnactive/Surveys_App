import React from "react";

const EmptyCard = ({ imgsrc, message, btnText, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Clickable Icon/Image */}
      <div
        className="mb-6 cursor-pointer text-gray-400 transition hover:scale-105"
        onClick={handleClick}
      >
        {typeof imgsrc === "string" ? (
          <img
            src={imgsrc}
            alt="Empty state"
            className="w-24 h-24 object-contain mx-auto"
          />
        ) : (
          <div className="text-6xl sm:text-7xl text-primary">{imgsrc}</div>
        )}
      </div>

      {/* Message */}
      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6">
        {message}
      </p>

      {/* Button */}
      {btnText && onClick && (
        <button
          onClick={handleClick}
          className="btn-primary w-auto px-6 py-2 text-sm font-medium"
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export default EmptyCard;
