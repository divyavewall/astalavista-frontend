// import React from 'react'
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";


//user object
interface PropsType {
    user: User | null;
}
const Header = ({ user }: PropsType) => {
    //to manage the state of dialog box 
    const [isOpen, setIsOpen] = useState<boolean>(false);

    //Handler for logout starts
    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Sign Out Successfully");
            setIsOpen(false)
        } catch (error) {
            toast.error("something went wrong");
        }
    };
    //handler for logout ends

    return <nav className="header">
        <Link onClick={() => setIsOpen(false)} to={"/"}> Home </Link>
        <Link onClick={() => setIsOpen(false)} to={"/search"}> <FaSearch /> </Link>
        <Link onClick={() => setIsOpen(false)} to={"/cart"}> <FaShoppingBag /> </Link>


        {user?._id ? (
            <>
                <button onClick={() => setIsOpen((prev) => !prev)}><FaUser /></button>
                <dialog open={isOpen}>
                    <div>
                        {user.role === 'admin' && (
                            <Link to="/admin/dashboard">Admin</Link>
                        )}

                        <Link to="/orders">Orders</Link>
                        <button onClick={logoutHandler}><FaSignOutAlt /></button>
                    </div>
                </dialog>
            </>
        ) : (
            <Link to={"/login"}><FaSignInAlt /></Link>
        )}
    </nav>
}

export default Header