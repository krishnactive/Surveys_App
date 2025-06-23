import React, { useState } from "react";
import {
  FaBookmark,
  FaRegBookmark,
  FaTrash,
  FaTimesCircle,
  FaPaperPlane,
} from "react-icons/fa";

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 min-w-[120px]">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}

      {isMyPoll && !pollClosed && (
        <button
          className="btn-small flex items-center gap-1 text-orange-500 bg-orange-500/20 hover:bg-orange-500 hover:text-white"
          onClick={onClosePoll}
          disabled={loading}
        >
          <span className="hidden sm:inline">Close</span>
          <FaTimesCircle className="sm:hidden text-lg" />
        </button>
      )}

      {isMyPoll && (
        <button
          className="btn-small flex items-center gap-1 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white"
          onClick={onDelete}
          disabled={loading}
        >
          <span className="hidden sm:inline">Delete</span>
          <FaTrash className="sm:hidden text-lg" />
        </button>
      )}

      <button className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className="text-primary" />
        ) : (
          <FaRegBookmark />
        )}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button
          className="btn-small flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
          onClick={handleVoteClick}
          disabled={loading}
        >
          <span className="hidden sm:inline">
            {loading ? "Submitting..." : "Submit"}
          </span>
          {!loading && <FaPaperPlane className="sm:hidden text-lg" />}
        </button>
      )}
    </div>
  );
};

export default PollActions;
