import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { SIDE_MENU_DATA } from "../../utils/data";
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import PollCard from '../../components/layout/PollsCards/PollCard';
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';
import { FiPlusCircle } from "react-icons/fi";
import PollDownloadButton from '../../components/input/PollDownloadButton';

const PAGE_SIZE = 5;

const MyPolls = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading || !user?._id) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      const fetchedPolls = response.data?.polls || [];

      if (fetchedPolls.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1 ? fetchedPolls : [...prevPolls, ...fetchedPolls]
        );
        setStats(response.data?.stats || []);
        setHasMore(fetchedPolls.length === PAGE_SIZE);
      } else {
        if (overridePage === 1) setAllPolls([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Error while fetching polls.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType,user]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls(page);
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto px-4">
        <HeaderWithFilter
          title="My Surveys"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading ? (
          <EmptyCard
            imgsrc={<FiPlusCircle className="text-primary text-6xl sm:text-7xl" />}
            message="Welcome to SurveysApp! It looks like you haven’t created any polls yet. Be the first to get started."
            btnText="Create Poll"
            onClick={() => navigate("/create-polls")}
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
              <div>
                  <PollCard
                key={`dashboard_${poll._id}`}
                pollId={poll._id}
                question={poll.question}
                type={poll.type}
                options={poll.options}
                voters={poll.voters.length || 0}
                responses={poll.responses || []}
                creatorProfileImg={poll.creator?.profileImageUrl || null}
                creatorName={poll.creator?.fullName}
                creatorUsername={poll.creator?.username}
                userHasVoted={poll.userHasVoted || false}
                isPollClosed={poll.closed || false}
                createdAt={poll.createdAt || false}
                isMyPoll
              />
              <PollDownloadButton pollId={poll._id} />
              </div>
              
              
            ))}
          </InfiniteScroll>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;
