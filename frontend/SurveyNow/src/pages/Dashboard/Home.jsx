import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { SIDE_MENU_DATA } from "../../utils/data";
import useUserAuth from '../../hooks/useUserAuth';

const Home = () => {
  useUserAuth()
  return (

    <div>
      <DashboardLayout activeMenu='Dashboard'> 
        <div>home</div>
      </DashboardLayout>
      
    </div>
  )
}

export default Home
