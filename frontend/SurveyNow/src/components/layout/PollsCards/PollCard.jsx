import React, { useCallback, useContext, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { getPollBookmarked } from '../../../utils/helper';
import UserProfileInfo from "../../cards/UserProfileInfo";
import PollActions from './PollActions';
import PollContent from './PollContent';
import {API_PATHS} from "../../../utils/apiPaths"
import { toast } from 'react-hot-toast';
import axiosInstance from '../../../utils/axiosInstance';
import SurveyResultContent from './SurveyResultContent';

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isPollClosed,
  createdAt,
  // isMyPoll,
}) => {

    const {user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete} = useContext(UserContext);

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [rating, setRating] = useState(0);
    const [userResponse, setUserResponse] = useState("");

    const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

    const [pollResult, setPollResult] = useState({
        options,
        voters,
        responses,
    });

    const isPollBookmarked = getPollBookmarked(
        pollId,
        user.bookmarkedPolls||[]
    );
const isMyPoll = user?.email === creatorUsername;

const [PollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
const [pollClosed, setPollClosed] = useState(isPollClosed || false);
const [pollDeleted, setPollDeleted] = useState(false);

//Handle user input
const handleInput = (value)=>{
    if(type=="rating") setRating(value)
    else if(type=="open-ended")setUserResponse(value);
    else setSelectedOptionIndex(value);
}

//generating post data based on the survey type
const getPostData = useCallback(() => {
  const voterId = user._id;

  switch (type) {
    case "open-ended":
      return { responseText: userResponse, voterId };

    case "rating":
      return { optionIndex: rating - 1, voterId };

    default:
      return { optionIndex: selectedOptionIndex, voterId };
  }
}, [type, userResponse, rating, selectedOptionIndex, user]);


//getting survey details by ID
const getPollDetails = async () => {
  try {
    const { data } = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(pollId));

    if (data) {
      const { options = [], voters = [], responses = [] } = data;

      setPollResult({
        options,
        voters: voters.length,
        responses,
      });
    }
  } catch (error) {
    console.error(
      error?.response?.data?.message || "An error occurred while fetching the poll details."
    );
  }
};


//handling the submission of surveys
const handleVoteSubmit = async()=>{
    try {
        const response = await axiosInstance.post(
            API_PATHS.POLLS.VOTE(pollId),
            getPostData()
        );

        getPollDetails();
        setIsVoteComplete(true);
        onUserVoted();
        toast.success("voted")
        
    } catch (error) {
        console.error(error.response?.data?.message || "Error while submitting your vote")    
    }
}


// Server + local toggle for poll bookmark
  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );

      toggleBookmarkId(pollId);
      setPollBookmarked((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error bookmarking the Poll"
      );
    }
  };

  //closing poll logic
  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));
      if(response.data){
        setPollClosed(true);
        toast.success(response.data?.message || "Survey closed SuccessFully!")
      }
    } catch (error) {
        toast.error("something went wrong, Please try again.")
        console.log("Something went wrong, Please try after some time", error);
    }
  }


//delete poll logic
    const deletePoll = async () => {
    try {
      const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));
      if(response.data){
        setPollDeleted(true);
        onPollCreateOrDelete("delete", pollId);
        toast.success(response.data?.message || "Survey deleted SuccessFully!")
      }
    } catch (error) {
        toast.error("something went wrong, Please try again.")
        console.log("Something went wrong, Please try after some time", error);
    }
  }



  return (
     !pollDeleted && <div className='bg-slate-100/50 my-5 p-5 rounded-lg border-slate-100 mx-auto'>
        <div className='flex items-start justify-between gap-3 '>
            <UserProfileInfo 
                imgUrl = {creatorProfileImg}
                fullName = {creatorName}
                username = {creatorUsername}
                createdAt = {createdAt}
             />   
            <PollActions
                pollId = {pollId}
                isVoteComplete = {isVoteComplete}
                inputCaptured = {
                    !!(userResponse || selectedOptionIndex >= 0 || rating)
                }
                onVoteSubmit = {handleVoteSubmit}
                isBookmarked = {PollBookmarked}
                toggleBookmark = {toggleBookmark}
                isMyPoll = {isMyPoll}
                pollClosed = {pollClosed}
                onClosePoll={closePoll}
                onDelete={deletePoll}
            />
           
        </div>

      {/* {question} */}
      <div className='ml-14 mt-3'>
        <p className='text-[15px] text-black leading-8'> {question} </p>
        <div className='mt-4'>
            {isVoteComplete||isPollClosed?(
                // <>
                //     show result
                // </>
                <SurveyResultContent
                  type={type}
                  options={pollResult.options || []}
                  voters={pollResult.voters}
                  responses={pollResult.responses||[]}
                />
            ):(
                <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
            />
            )}
            
        </div>
      </div>
    </div>
  )
}

export default PollCard
