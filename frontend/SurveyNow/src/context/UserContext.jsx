import React, {createContext, useState} from 'react'
export const UserContext = createContext();

const UserProvider = ({children}) => {

    const [user, setUser] = useState(null);

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

    //update totalpollscreated count locally
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollsCreated = user.totalPollsCreated || 0;
        updateUserStats(
            type == "create" ? totalPollsCreated + 1 : totalPollsCreated - 1
        );
    }


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
        }}
    >
        {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
