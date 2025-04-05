import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}){
 const [isAuthorized, setIsAuthorized] = useState(null);
 
 useEffect(() => {
    auth().catch(()=>{
        setIsAuthorized(false);
    })
 },[])

    const refreshToken = async () => {

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // sending a request to the backend server to refresh the token

            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });

            // if the response is successful, then set the new access token in local storage
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }


        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }

    }

    //  check if the token is expired or not
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("token from protected route",token)
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        console.log("token expiration", tokenExpiration)
        if (tokenExpiration < now ) {
            // token is expired
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    }

 if (isAuthorized === null){
    return <div>
        loading...
    </div>
 }
 return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
