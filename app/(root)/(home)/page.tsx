import React from "react";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <main>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
};

export default Home;
