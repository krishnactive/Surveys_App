import React, { useState } from 'react';
import { IoCloseOutline, IoFilterOutline } from 'react-icons/io5';
import { POLL_TYPE } from '../../utils/data';

const HeaderWithFilter = ({ title, filterType, setFilterType }) => {
  const [open, setOpen] = useState(false);

  const toggleFilter = () => {
    if (filterType !== '') setFilterType('');
    setOpen(!open);
  };

  return (
    <div className="w-full">
      {/* Header with Filter Button */}
      <div className="flex items-center justify-between">
        <h2 className="sm:text-xl text-base font-semibold text-black">
          {title}
        </h2>
        <button
          onClick={toggleFilter}
          className={`flex items-center gap-2 text-sm text-white bg-primary px-4 py-2 transition-all
            ${open ? 'rounded-t-lg' : 'rounded-lg'}`}
        >
          {filterType !== '' ? (
            <IoCloseOutline className="text-lg" />
          ) : (
            <>
              <IoFilterOutline className="text-lg" />
              <span className="hidden sm:inline">Filter</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {open && (
        <div className="flex flex-wrap gap-3 bg-primary p-4 rounded-l-lg rounded-b-lg mt-1">
          {[{ label: 'All', value: '' }, ...POLL_TYPE].map((type) => (
            <button
              key={type.value}
              className={`text-xs sm:text-sm px-4 py-1 rounded-lg whitespace-nowrap transition-all
                ${
                  filterType === type.value
                    ? 'bg-green-900 text-white'
                    : 'bg-green-100 text-gray-800 hover:bg-green-200'
                }`}
              onClick={() => setFilterType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderWithFilter;
