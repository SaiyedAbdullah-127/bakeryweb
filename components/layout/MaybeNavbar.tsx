"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
 
 const MaybeNavbar: React.FC = () => {
  return <Navbar />;

export default MaybeNavbar;
