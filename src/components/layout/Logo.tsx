
import React from "react";
import { Link } from "react-router-dom";

type LogoProps = {
  variant?: "full" | "compact";
};

const Logo: React.FC<LogoProps> = ({ variant = "full" }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative w-10 h-10">
        <img
          src="/lovable-uploads/f3c433cb-2627-44da-9adf-e040b6f29cd4.png"
          alt="Multilimp Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {variant === "full" && (
        <span className="text-xl font-bold ml-2 text-multilimp-navy-dark">
          MULTILIMP<span className="text-multilimp-green text-sm">SAC</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
