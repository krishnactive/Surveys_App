import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import PollCard from '../../components/layout/PollsCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import EmptyCard from '../../components/cards/EmptyCard';
import { FiPlusCircle } from 'react-icons/fi';

const PAGE_SIZE = 5;

const VotedPolls = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  // const loadMorePolls = () => {
  //   setPage((prevPage) => prevPage + 1);
  // };

  const fetchAllPolls = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>[...prevPolls, ...response.data.polls]);
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
    
      <DashboardLayout activeMenu="Voted Poll">
        <div className="my-5 mx-auto">
          <h2 className='text-xl font-medium text-black'>Voted Polls</h2>

          {allPolls.length === 0 && !loading && (
            <EmptyCard
              imgsrc={<FiPlusCircle className="text-primary text-6xl sm:text-7xl" />}
              message="you have not participated in any survey"
              btnText="Explore"
              onClick={() => navigate('/dashboard')}
            />
          ) }
              {allPolls.map((poll) => (
                <PollCard
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
              ))}
        </div>
      </DashboardLayout>
  );
};

export default VotedPolls;
