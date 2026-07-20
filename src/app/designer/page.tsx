"use client";

import ChatTab from "src/components/ChatTab";


export default function DesignerPage() {
  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#FFFFF0] p-6 sm:p-4 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        <ChatTab 
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}
        />
      </div>
    </main>
  );
}