import React from "react";
import CharAvatar from "./CharAvatar";
import moment from "moment";
import { BsDot } from "react-icons/bs";
const UserProfileInfo = ({ imgUrl, fullName = "", username = "", createdAt }) => {
  return (
    <div className="flex items-center gap-3">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={fullName}
          className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
        />
      ) : (
        <CharAvatar
          fullName={fullName}
          className="text-sm bg-gradient-to-br from-indigo-200 to-purple-200 shadow-inner"
        />
      )}

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
          {fullName}
          {createdAt && (
            <>
            <div className="flex items-center  text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
              <BsDot className="text-gray-400 text-sm sm:text-base" />
              <span className="font-normal">
                {moment(createdAt).fromNow()}
              </span>
            </div>


            </>
            
          )}
        </div>
        <span className="text-xs p-1 text-gray-500">@{username}</span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
