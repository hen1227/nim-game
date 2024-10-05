import React, {useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    const [showHome, setShowHome] = React.useState(true);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        console.log(path);
        setShowHome(path !== '/');
    }, [location]);

    return (
        <nav className="navbar">
            {showHome && (
                <Link to="/">Home</Link>
            )}
        </nav>
    );
};

export default Navbar;
