import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'; // correct path
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../../components/cards/Loader';


export default function OauthSuccess() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    
    if (token) {
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axiosInstance.get("/api/v1/auth/getUser")
        .then(res => {
          updateUser(res.data);
          navigate("/dashboard");
        })
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  return <Loader/>
}
