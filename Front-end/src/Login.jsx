import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login() {
    //Set variables to hold the email and password
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Function that handles the user submitting their username and ppasswword
    async function handleLogin(event) {
        event.preventDefault();
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();
        console.log(data);
    }


return (
    <div className = "login-page">
        <form onSubmit={handleLogin} className="login-box">
            <h1>Log in</h1>

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

             <button type = "submit"> Log in </button>

             <p>Don't have an account?</p>
                <button type = "button" onClick={() => navigate("/signup")}> Sign up </button>
        </form>
    </div>
    )
}

