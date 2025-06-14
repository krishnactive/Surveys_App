import React from "react";
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }) => {
  // Handle adding an image file
  const handleAddImage = (event) => {
    const file = event.target.files[0];

    // Check for file and limit the number of images
    if (file && imageList.length < 4) {
      const reader = new FileReader();

      // Convert image to base64 once loaded
      reader.onload = () => {
        // Add base64 string and file reference to imageList
        setImageList([...imageList, { base64: reader.result, file }]);
      };

      reader.readAsDataURL(file); // Read image as DataURL (base64)
      event.target.value = null; // Reset file input
    }
  };

  // Handle deleting an image by index
  const handleDeleteImage = (index) => {
    const updatedImages = imageList.filter((_, i) => i !== index);
    setImageList(updatedImages);
  };

  return (
    <div>
      {/* Image preview grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {imageList.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-md relative shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.base64}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-36 object-contain rounded-md"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              className="text-red-500 bg-white rounded-full p-2 absolute top-2 right-2 shadow-md hover:text-red-700 transition"
              aria-label={`Delete image ${index + 1}`}
            >
              <HiOutlineTrash className="text-lg" />
            </button>
          </div>
        ))}
      </div>

      {/* File input for selecting image */}
      {imageList.length < 4 && (
        <div className="flex items-center gap-4">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleAddImage}
            className="hidden"
            id="imageInput"
          />

          {/* Styled label as a trigger for file input */}
          <label
            htmlFor="imageInput"
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <HiMiniPlus className="text-lg" />
            Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
