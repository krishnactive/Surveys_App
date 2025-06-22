import React, { useContext, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { getPollBookmarked } from '../../../utils/helper';
import UserProfileInfo from "../../cards/UserProfileInfo";

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
}) => {

    const {user} = useContext(UserContext);

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


const [PollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
const [pollClosed, setPollClosed] = useState(isPollClosed || false);
const [pollDeleted, setPollDeleted] = useState(false);

  return (
     !pollDeleted && <div className='bg-slate-100/50 my-5 p-5 rounded-lg border-slate-100 mx-auto'>
        <div className='flex items-start justify-between'>
            <UserProfileInfo 
                imgUrl = {creatorProfileImg}
                fullName = {creatorName}
                username = {creatorUsername}
                createdAt = {createdAt}
             />   

           
        </div>
      {/* {question} */}
    </div>
  )
}

export default PollCard
