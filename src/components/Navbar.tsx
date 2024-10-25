"use client";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { User } from "next-auth";
import logo from "@/components/logo_feedback.png";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Toggle navbar open/close for mobile view
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 p-2 shadow-lg z-50 flex justify-between items-center flex-wrap sm:p-4">
        {/* Logo and Title */}
        <div className="flex flex-row items-center px-2 sm:px-3">
          <Image
            src={logo}
            alt="logo"
            width={40}
            height={40}
            className="object-cover rounded-xl"
            priority
          />
          <h2 className="cursor-pointer text-xl sm:text-2xl uppercase font-bold pl-2 sm:pl-4">
            <Link href="/">Feedback</Link>
          </h2>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-4 items-center">
          {session ? (
            <>
              {/* Welcome User and Sign Out */}
              <li className="uppercase py-1 px-2 sm:py-2 sm:px-3 text-gray-800 font-semibold">
                Welcome{" "}
                <span className="text-xl font-bold text-blue-600">
                  {user.username || user.email}
                </span>
              </li>
              <li className="py-1 sm:py-2 px-2 sm:px-4 cursor-pointer text-white bg-blue-900 hover:bg-blue-700 transition-colors rounded-lg">
                <button onClick={() => signOut()}>Sign Out</button>
              </li>
            </>
          ) : (
            <>
              {/* Sign Up and Login */}
              <a href="/sign-up">
                <li className="py-1 sm:py-2 px-2 sm:px-4 cursor-pointer text-gray-800 hover:text-gray-500">
                  Sign Up
                </li>
              </a>
              <a href="/sign-in">
                <li className="py-1 sm:py-2 px-2 sm:px-4 cursor-pointer text-white bg-blue-900 hover:bg-blue-700 transition-colors rounded-lg">
                  Login
                </li>
              </a>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <span
          className="lg:hidden cursor-pointer flex gap-4 h-full"
          onClick={toggleNavbar}
        >
          <span className="h-full flex flex-col justify-center py-1 sm:py-2">
            {!isNavbarOpen ? (
              <FaBars size={20} />
            ) : (
              <FaBarsStaggered size={20} />
            )}
          </span>
        </span>

        {/* Mobile Navbar */}
        {isNavbarOpen && (
          <div className="absolute top-full left-0 w-full bg-[#E6E6FA] pt-2 z-50">
            <ul className="flex flex-col gap-2 uppercase font-medium text-center">
              {session ? (
                <>
                  {/* Mobile Welcome and Sign Out */}
                  <li className="py-2 px-4 text-gray-800">
                    Welcome{" "}
                    <span className="text-xl font-bold text-blue-600">
                      {user?.username || user?.email}
                    </span>
                  </li>
                  <li className="py-1 sm:py-2 px-4 cursor-pointer text-white bg-blue-900 hover:bg-blue-700 transition-colors rounded-lg">
                    <button onClick={() => signOut()}>Sign Out</button>
                  </li>
                </>
              ) : (
                <>
                  {/* Mobile Sign Up and Login */}
                  <a href="/sign-up">
                    <li className="py-1 sm:py-2 px-4 cursor-pointer text-gray-800 hover:text-gray-500">
                      Sign Up
                    </li>
                  </a>
                  <a href="/sign-in">
                    <li className="py-1 sm:py-2 px-4 cursor-pointer text-white bg-blue-900 hover:bg-blue-700 transition-colors rounded-lg">
                      Login
                    </li>
                  </a>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden by the navbar */}
      <div className="h-[60px] sm:h-[80px]"></div>
    </>
  );
};

export default Navbar;
