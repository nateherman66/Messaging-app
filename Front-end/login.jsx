import { useState } from "react"

export default function Login() {
    //Set variables to hold the email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Function that handles the user submitting their username and ppasswword
    function handleLogin(event) {
        event.preventDefault();
        console.log("Email: ", email);
        console.log("Password: ", password);

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

             <p>Sign up</p>
        </form>
    </div>
    )
}

