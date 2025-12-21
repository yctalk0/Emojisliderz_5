import React from 'react';

const OfflineBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="96"
        height="96"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-red-500 mb-4"
      >
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
        <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
        <path d="M10.66 5.5C12.43 4.8 14.27 4.5 16 4.5a15 15 0 0 1 5.83 2.65" />
        <path d="M18.83 12.83a15 15 0 0 1-2.09 2.09" />
        <path d="M22 12c0-2.76-1.12-5.26-2.93-7.07" />
      </svg>
      <h2 className="text-3xl font-bold mb-2">You are offline</h2>
      <p className="text-lg text-muted-foreground">
        Please check your internet connection and try again.
      </p>
    </div>
  );
};

export default OfflineBanner;
