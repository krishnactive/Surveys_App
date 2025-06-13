import React, { useState } from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

const OptionInput = ({ optionList, setOptionList }) => {
  const [option, setOption] = useState("");

  // Add a new option if input is valid and under 4 options
  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption(""); // Reset input field
    }
  };

  // Remove option by index
  const handleDeleteOption = (index) => {
    const updatedOptions = optionList.filter((_, i) => i !== index);
    setOptionList(updatedOptions);
  };

  return (
    <div className="space-y-3">
      {/* Render each option with delete button */}
      {optionList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm hover:shadow transition-all"
        >
          <span className="text-sm font-medium text-gray-800">{item}</span>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label={`Delete option ${item}`}
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}

      {/* Input field for adding new option, limited to 4 total */}
      {optionList.length < 4 && (
        <div className="flex items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Enter option"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="flex-1 text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Add button - disabled if input is empty or whitespace */}
          <button
            onClick={handleAddOption}
            disabled={!option.trim()}
            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md font-medium transition 
              ${
                option.trim()
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            <HiMiniPlus className="text-lg" />
            Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
