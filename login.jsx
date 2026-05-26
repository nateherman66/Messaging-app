import { useState } from React

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

