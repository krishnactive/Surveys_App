import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { VscJson } from "react-icons/vsc";
import { BiCodeAlt } from "react-icons/bi";
import { AiOutlineFileExcel } from "react-icons/ai";


const PollDownloadDropdown = ({ pollId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Oopen = useRef(null);

  useEffect (()=>{
    const handleClickOutSide = (e)=>{
        if(Oopen.current && !Oopen.current.contains(e.target)){
            setIsOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };

  },[]);


  const handleDownload = async (format) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/poll/${pollId}/download?format=${format}`
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `poll.${format === "json" ? "json" : "csv"}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsOpen(false);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-white text-xs hover:bg-green-700 transition-colors"
      >
        <HiOutlineDownload className="w-4 h-4" />
        Download
      </button>
      {isOpen && (
        <div  ref={Oopen} className="absolute  mt-2 w-36 bg-white border rounded-md shadow-lg z-10 ml-[8px] ">
          <button
            onClick={() => handleDownload("csv")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50"
          >
            <AiOutlineFileExcel className="inline mr-2" />.CSV
          </button>
          <button
            onClick={() => handleDownload("json")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50"
          >
            <VscJson className="inline mr-2" />.JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default PollDownloadDropdown;
