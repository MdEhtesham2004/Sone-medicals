import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";


function Form({route,method}){
    const [ username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    const handleSubmit =  async (e) => {
        setLoading(true);
        e.preventDefault(); 
        // prevent the default form submission behavior
        try{
            const res = await api.post(route, {username,password});
            console.log(res.data)
            console.log("method :",method)
            if (method === "login"){
                window.localStorage.setItem(ACCESS_TOKEN, res.data.access);
                window.localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                console.log("Access Token:", res.data.access);
                console.log("Refresh Token:", res.data.refresh);
                console.log("Login successful");
                navigate("/");
                
            }else{
                alert("User Created Successfully")
                navigate("/login")
            }
        }catch(error){
            alert(error)
            console.error("Error:", error);
        }finally{
            setLoading(false);
        }


    }   
        return <form onSubmit={handleSubmit}className="form-container">

        <h1>{name}</h1>
        <input className="form-input" type="text" placeholder="Username" value={username}
         onChange={(e)  => setUsername(e.target.value)} required/>
        <input  className="form-input" type="password" placeholder="Password" value={password}
         onChange={(e) => setPassword(e.target.value)} required/>
         <button className="form-button" type="submit" > {name} </button>

    </form>
    
    

}
export default Form;
