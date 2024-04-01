import React from "react";
import { UserButton as Button } from "@clerk/nextjs";

const Home = () => {
  return (
    <main>
      <Button afterSignOutUrl="/" />
    </main>
  );
};

export default Home;
