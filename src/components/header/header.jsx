import React, { useState, useEffect } from "react";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import {auth, googleProvider} from "../../config/firebase"
import {signInWithPopup,signOut} from "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"

import "./style.scss";


const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showSearch, setShowSearch] = useState("");
    const [user]=useAuthState(auth)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // console.log(auth?.currentUser?.photoURL)
    const signInWithGoogle = async ()=>{
        try{
            await signInWithPopup(auth,googleProvider);
        }
        catch(err)
        {
            console.error(err);
        }

    }
    const signOutFromGoogle = async ()=>{
        try{
            await signOut(auth);
        }
        catch(err)
        {
            console.error(err);
        }

    }
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

   

  

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "query") 
        {
            navigate("/query");
        } 
        else if(type=="wishlist")
        {
            navigate("/wishlist");
        }
        else
        {
            navigate("/");
        }
        setMobileMenu(false);
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("random")}
                    >
                        Random
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("query")}
                    >
                        Query
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("wishlist")}
                    >
                        Wish List
                    </li>
                    <li/>
                        
                </ul>
                {user?
                <button className="button-33" onClick={signOutFromGoogle}>sign out</button>:
                <button className="button-33" onClick={signInWithGoogle}>sign in</button>}
                <div className="mobileMenuItems">
                    
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>
            
        </header>
    );
};

export default Header;
