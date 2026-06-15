"use client";

import React from "react";
import { Menu, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

const Hamburger: React.FC<Props> = ({ isOpen, onToggle, className = "" }) => {
  return (
    <button
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={onToggle}
      className={`p-2 hover:bg-secondary rounded-xl transition-colors focus:outline-none ${className}`}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
};

export default Hamburger;
