import { application } from "express";
import { useState } from "react"

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



function handleSignup() {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers : {"Content-type": "application/json"},
        body: JSON.stringify ({
            username, email, password
        })
    });
    const data = await response.json();

    console.log(data);
    // This information wwill be sent to the backend 
}

return (
    <div className = "signup-page">
        <form onSubmit={handleSignup} className="signup-box">
            <h1>Create Account</h1>

            <input
            type= "username"
            placeholder= "Username"
            value = {username}
            onChange={(event) => setUsername(event.target.value)}
            />

            <input
            type = "email"
            placeholder = "Email"
            value = {email}
             onChange={(event) => setEmail(event.target.value)}
             />

             <input
             type = "password"
             placeholder="Password"
             value = {password}
             onChange={(event) => setPassword(event.target.value)}
             />

             <button type = "submit"> Sign up </button>
        </form>
    </div>
    );
}
