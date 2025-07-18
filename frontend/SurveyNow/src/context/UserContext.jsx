import React, {createContext, useState} from 'react'
export const UserContext = createContext();

const UserProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState([]);

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    //function to clear user data (e.g., on logout)

    const clearUser = () =>{
        setUser(null);
    };


    //update user stats
    const updateUserStats = (key, value) => {
        setUser((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    //updating total polls voted count locally
    const onUserVoted = () =>{
        const totalPollsVotes = user.totalPollsVotes || 0;
        updateUserStats("totalPollsVotes", totalPollsVotes+1);
    };

    const onPollCreateOrDelete = (type = "create", deletedPollId = null) => {
      setUser((prev) => {
        if (!prev) return prev;

        let totalPollsCreated = prev.totalPollsCreated || 0;
        let totalPollsBookmarked = prev.totalPollsBookmarked || 0;
        let updatedBookmarks = prev.bookmarkedPolls || [];

        if (type === "create") {
          totalPollsCreated += 1;
        } else if (type === "delete") {
          totalPollsCreated = Math.max(totalPollsCreated - 1, 0);

          if (deletedPollId) {
            if (updatedBookmarks.includes(deletedPollId)) {
              updatedBookmarks = updatedBookmarks.filter(id => id !== deletedPollId);
              totalPollsBookmarked = updatedBookmarks.length;
            }
          }
        }

        return {
          ...prev,
          totalPollsCreated,
          bookmarkedPolls: updatedBookmarks,
          totalPollsBookmarked,
        };
      });
    };



    //adding or removing poll id from bookmarkedPolls
    const toggleBookmarkId = (id) => {
  setUser((prev) => {
    const bookmarks = prev.bookmarkedPolls || [];
    const index = bookmarks.indexOf(id);

    if (index === -1) {
      return {
        ...prev,
        bookmarkedPolls: [...bookmarks, id],
        totalPollsBookmarked: prev.totalPollsBookmarked + 1,
      };
    } else {
      return {
        ...prev,
        bookmarkedPolls: bookmarks.filter((item) => item !== id),
        totalPollsBookmarked: prev.totalPollsBookmarked - 1,
      };
    }
  });
};




  return (
    <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            onPollCreateOrDelete,
            onUserVoted,
            toggleBookmarkId,
            stats, 
            setStats,
        }}
    >
        {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
