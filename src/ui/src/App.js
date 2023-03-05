import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from 'react-router-dom';
import Library from "./components/books/Library.jsx";
import Login from "./components/Login.jsx";

function App() {

    const [userName, setUserName] = useState("");

    const handleLogin = (username) => {
        setUserName(username);
    }

    return (
        userName ?
                <Routes>
                    <Route path="/" exact element={
                        <Library
                            username={userName}
                            setUserName={setUserName}
                        />}
                    />
                </Routes>
                :
                <Routes>
                    <Route path="/" exact element={
                        <Login
                            onLogin={handleLogin}
                        />
                    }/>
                </Routes>

    );
}

export default App;
