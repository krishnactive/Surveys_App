import React from 'react';
import { BsCircleFill } from 'react-icons/bs';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          <BsCircleFill className="text-primary animate-bounce [animation-delay:0s]" size={16} />
          <BsCircleFill className="text-primary animate-bounce [animation-delay:0.2s]" size={16} />
          <BsCircleFill className="text-primary animate-bounce [animation-delay:0.4s]" size={16} />
        </div>

        <p className="text-sm text-gray-500">Setting up your surveysApp environment...</p>
      </div>
    </div>
  );
};

export default Loader;
