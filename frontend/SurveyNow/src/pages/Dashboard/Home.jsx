import React, { useContext, useEffect, useState } from 'react';
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
import { UserContext } from '../../context/UserContext';

const PAGE_SIZE = 5;

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');

  const { stats,setStats } = useContext(UserContext);

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1 ? response.data.polls : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
    return () => {};
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls(page);
    }
    return () => {};
  }, [page]);

  return (
    <div>
      <DashboardLayout activeMenu="Dashboard" stats = {stats || []} showStats>
        <div className="my-5 mx-auto">
          <HeaderWithFilter
            title="Polls"
            filterType={filterType}
            setFilterType={setFilterType}
          />

          {allPolls.length === 0 && !loading ? (
            <EmptyCard
              imgsrc={<FiPlusCircle className="text-primary text-6xl sm:text-7xl" />}
              message="Welcome to SurveysApp! It looks like there are no polls yet. Be the first to create one and get things started."
              btnText="Create Poll"
              onClick={() => navigate('/create-polls')}
            />
          ) : (
            <InfiniteScroll
              dataLength={allPolls.length}
              next={loadMorePolls}
              hasMore={hasMore}
              loader={<h4 className="info-text">Loading...</h4>}
              endMessage={<p className="info-text">No more surveys to display.</p>}
            >
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
                  creatorUsername={poll.creator.email}
                  userHasVoted={poll.userHasVoted || false}
                  isPollClosed={poll.closed || false}
                  createdAt={poll.createdAt || false}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Home;
