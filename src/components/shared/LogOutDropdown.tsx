"use client";
import { useToast } from "@/hooks/use-toast";
import { logoutUser } from "@/src/lib/actions/auth";
import { logout } from "@/src/lib/redux/features/authSlice";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { IUserType } from "@/src/types/auth";
import { LogOutIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type User = Partial<IUserType>;

interface LogOutDropdownProps {
  user: User;
}

const LogOutDropdown: React.FC<LogOutDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    router.replace("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={
            user.avatar ||
            "https://res.cloudinary.com/dglsw3gml/image/upload/v1742799359/bicycle-shop/avatar_jrnud5.jpg"
          }
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-blue-100 hover:scale-105 transition-transform"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-4 text-center border-b">
            <h3 className="text-sm font-semibold text-gray-800">{user.name}</h3>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Link
            href={`/profile`}
            className="w-full flex items-center gap-2 px-4 py-3 text-blue-500 hover:bg-gray-100 transition"
          >
            <User2Icon className="w-5 h-5" />
            Profile
          </Link>
          <hr />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-blue-700 hover:bg-gray-100 transition"
          >
            <LogOutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogOutDropdown;
