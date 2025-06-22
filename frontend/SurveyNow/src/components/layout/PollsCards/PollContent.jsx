import React from 'react';
import OptionInputTile from '../../input/OptionInputTile';
import Rating from '../../input/Rating';
import ImageOptionInputTile from '../../input/ImageOptionInputTile';
const PollContent = ({
  type = '',
  options = [],
  selectedOptionIndex,
  onOptionSelect = () => {},
  rating = 0,
  onRatingChange = () => {},
  userResponse = '',
  onResponseChange = () => {},
}) => {
  switch (type) {
    case 'single-choice':
    case 'yes/no':
      return (
        <div className="space-y-2">
          {options.map((option, index) => (
            <OptionInputTile
              key={option._id || index}
              isSelected={selectedOptionIndex === index}
              label={option.optionText || ''}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </div>
      );

    case 'rating':
      return (
        <div className="mt-2">
          <Rating value={rating} onChange={onRatingChange} />
        </div>
      );

    case 'open-ended':
      return (
        <div className="mt-2">
          <textarea
            placeholder="Your response..."
            className="w-full text-sm text-black outline-none bg-slate-100 p-3 rounded-md resize-none border border-slate-200 focus:ring-1 focus:ring-primary"
            rows={4}
            value={userResponse}
            onChange={(e) => onResponseChange(e.target.value)}
          />
        </div>
      );
    case "image-based":
        return (
            <div className="grid grid-cols-2 gap-2 mt-2">
            {options.map((option, index) => (
                <ImageOptionInputTile
                key={option._id || index}
                isSelected={selectedOptionIndex === index}
                imgUrl={option.imageUrl || option.optionText || ""}
                label={option.optionText || `Option ${index + 1}`}
                onSelect={() => onOptionSelect(index)}
                />
            ))}
            </div>
        );
 

    default:
      return null;
  }
};

export default PollContent;
