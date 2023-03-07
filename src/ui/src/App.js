import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from 'react-router-dom';
import Library from "./components/books/Library.jsx";
import Login from "./components/Login.jsx";
import Statistics from "./components/books/Statistics.jsx";
import {useNavigate} from "react-router";
import CreateBookForm from "./components/CreateBookForm.jsx";

function App() {

    const [userName, setUserName] = useState("");

    const route = useNavigate();

    useEffect(() => {
        route('/login')
    }, []);

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
                <Route path="/stat" exact element={
                    <Statistics
                    />}
                />
                <Route path="/create_book" exact element={
                    <CreateBookForm
                    />}
                />
            </Routes>
            :
            <Routes>
                <Route path="/login" exact element={
                    <Login
                        onLogin={handleLogin}
                    />
                }/>
            </Routes>
    );
}

export default App;
