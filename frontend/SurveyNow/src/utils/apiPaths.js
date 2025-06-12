export const BASE_URL = import.meta.env.VITE_BASE_URL;

// utils/apiPaths.js

export const API_PATHS = {
    AUTH:{
        LOGIN: "api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
        UPDATE_PROFILE: "/api/v1/auth/update",
    },
    IMAGE: {
        UPLOAD_IMAGE: "api/v1/auth/upload-image"
    },
};