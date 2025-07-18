import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'; // correct path
import axiosInstance from '../../utils/axiosInstance';

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

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
