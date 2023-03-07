import React from 'react';
import logout from "../styles/logout.module.scss";

const Logout = (props) => {

    const {
        text,
        setUserName
    } = props;

    const logoutHandle = () => {
        setUserName(false);
        localStorage.setItem("userAuthenticated", false.toString())
        window.location.reload(false);
    }

    return (
        <div
            className={logout.link}
            onClick={logoutHandle}
        >
            {text}
        </div>
    );
};

export default Logout;