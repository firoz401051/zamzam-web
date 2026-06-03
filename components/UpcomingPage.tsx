import { Loader2 } from "lucide-react";
import React from "react";

const UpcomingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <Loader2 className="w-12 h-12 text-zamzam-primary animate-spin mb-4" />
      <h1 className="text-3xl font-bold mb-2 uppercase">
        Page is Coming Soon!
      </h1>
      <p className="text-zamzam-text-muted max-w-xl">
        We&apos;re working hard to bring you an amazing blog experience. Stay
        tuned for exciting content!
      </p>
    </div>
  );
};

export default UpcomingPage;
