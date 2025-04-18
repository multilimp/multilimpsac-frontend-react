
import React from "react";
import { Link } from "react-router-dom";
import IsotipoSVG from "@/assets/svg/isotipo-multilimp-06.svg";
type LogoProps = {
  variant?: "full" | "compact";
};

const Logo: React.FC<LogoProps> = ({ variant = "full" }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative w-10 h-10">
      <img
          src={IsotipoSVG}
          alt="Multilimp Logo"
          className="w-10 h-10 object-contain text-multilimp-green dark:text-multilimp-green-dark" 
        />
      </div>
      {variant === "full" && (

        <span className="text-xl font-bold ml-2 text-gray-200">
          MULTILIMP<span className="text-xl">SAC</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
