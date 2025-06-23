import moment from "moment";
import React from "react";
import CharAvatar from "../../cards/CharAvatar";

// Progress Bar for votes
const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className="w-full bg-slate-200/80 rounded-md h-6 relative mb-3 overflow-hidden">
      <div
        className="bg-sky-900/10 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium px-4">
        {label}
        <span className="text-[11px] text-slate-500">{progress}%</span>
      </span>
    </div>
  );
};

// Image-based Poll Result
const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => (
  <div>
    <div className="w-full bg-gray-800 rounded-md overflow-hidden mb-3">
      <img src={imgUrl} alt="option" className="w-full h-36 object-contain" />
    </div>
    <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
  </div>
);

// Open-ended Poll Response
const OpenEndedPollResponse = ({
  profileImgUrl,
  fullName,
  response,
  createdAt,
}) => (
  <div className="mb-6 ml-3">
    <div className="flex gap-3 items-center">
      {profileImgUrl ? (
        <img src={profileImgUrl} alt="profile" className="w-8 h-8 rounded-full" />
      ) : (
        <CharAvatar
          fullName={fullName}
          className="w-8 h-8 text-[10px] bg-sky-800/40"
        />
      )}

      <p className="text-[13px] text-black font-medium">
        {fullName}
        <span className="mx-1 text-[10px] text-slate-500">•</span>
        <span className="text-[10px] text-slate-500">{createdAt}</span>
      </p>
    </div>

    <p className="text-sm text-slate-700 mt-2 ml-[42px]">{response}</p>
  </div>
);

// Main Poll Result Handler
const SurveyResultContent = ({ type, options = [], voters = 0, responses = [] }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <div>
          {options.map((option) => (
            <PollOptionVoteResult
              key={option._id}
              label={`${option.optionText}${type === "rating" ? " Star" : ""}`}
              optionVotes={option.votes}
              totalVotes={voters}
            />
          ))}
        </div>
      );

    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <ImagePollResult
              key={option._id}
              imgUrl={option.optionText || ""}
              optionVotes={option.votes}
              totalVotes={voters}
            />
          ))}
        </div>
      );

    case "open-ended":
      return (
        <div>
          {responses.map((response) => (
            <OpenEndedPollResponse
              key={response._id}
              profileImgUrl={response.voterId?.profileImgUrl}
              fullName={response.voterId?.fullName || "Anonymous"}
              response={response.responseText}
              createdAt={response.createdAt ? moment(response.createdAt).fromNow() : ""}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default SurveyResultContent;
