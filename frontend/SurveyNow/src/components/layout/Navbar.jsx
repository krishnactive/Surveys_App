import React, { useState, useContext, useEffect, useRef } from 'react';
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import SideMenu from './SideMenu';
import { UserContext } from '../../context/UserContext';
import UserDetailsCard from '../cards/UserDetailsCard';
import TreadingPolls from './TreadingPolls';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { user ,stats } = useContext(UserContext);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center border-b border-white-100 bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-30">

      <div className="flex items-center gap-4">
        <button
          className="block lg:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
          aria-label={openSideMenu ? "Close Menu" : "Open Menu"}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-medium text-black">SurveysApp</span>
        </div>
      </div>

      <div className="relative md:hidden" ref={profileRef}>
        <button
          className="text-black focus:outline-none"
          onClick={() => setOpenProfile(prev => !prev)}
          aria-label={openProfile ? "Close Profile" : "Open Profile"}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            
            <FaUserCircle className="text-2xl" />
          )}
        </button>

        {openProfile && (
          <div className="absolute top-full right-0 mt-2 z-40 w-60">
            <UserDetailsCard
                profileImageUrl = {user && user.profileImageUrl}
                fullName = {user&& user.fullName}
                username = {user && user.username}
                totalPollsVotes = {user && user.totalPollsVotes}
                totalPollsCreated = {user && user.totalPollsCreated}
                totalPollsBookmarked = {user && user.totalPollsBookmarked}
            />
             <TreadingPolls stats = {stats}/> 
          </div>
        )}
      </div>

      {openSideMenu && (
        <div className="fixed top-[61px] left-0 w-64 bg-white shadow-md z-40">
          <SideMenu activeMenu={activeMenu} />
          
        </div>
      )}
    </div>
  );
};

export default Navbar;
