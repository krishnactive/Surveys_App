import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import PollCard from '../../components/layout/PollsCards/PollCard';
// import InfiniteScroll from 'react-infinite-scroll-component';
import EmptyCard from '../../components/cards/EmptyCard';
import { BsBookmark } from "react-icons/bs"
import { UserContext } from '../../context/UserContext';


const Bookmarks = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user } = useContext(UserContext)

  // const loadMorePolls = () => {
  //   setPage((prevPage) => prevPage + 1);
  // };

  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED);

      if (response.data?.bookmarkedPolls?.length > 0) {
        setBookmarkedPolls((prevPolls) =>[...prevPolls, ...response.data.bookmarkedPolls]);
      } 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchAllPolls();
    return () => {};
  }, []);

  return (
    <div>
      <DashboardLayout activeMenu="BookMarks">
        <div className="my-5 mx-auto">
          <h2 className='text-xl font-medium text-black'>Bookmarks</h2>

          {bookmarkedPolls.length === 0 && !loading && (
            <EmptyCard
              imgsrc={<BsBookmark className="text-primary text-6xl sm:text-7xl" />}
              message="you have not BookMarked any survey"
              btnText="Explore"
              onClick={() => navigate('/dashboard')}
            />
          )}
              {bookmarkedPolls.map((poll) => {
                if(!user?.bookmarkedPolls?.includes(poll._id)) return null;

                return <PollCard
                  key={`dashboard_${poll._id}`}
                  pollId={poll._id}
                  question={poll.question}
                  type={poll.type}
                  options={poll.options}
                  voters={poll.voters.length || 0}
                  responses={poll.responses || []}
                  creatorProfileImg={poll.creator.profileImageUrl || null}
                  creatorName={poll.creator.fullName}
                  creatorUsername={poll.creator.username}
                  userHasVoted={poll.userHasVoted || false}
                  isPollClosed={poll.closed || false}
                  createdAt={poll.createdAt || false}
                />
          })}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Bookmarks;
