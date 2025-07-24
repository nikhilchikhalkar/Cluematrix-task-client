import React from 'react';

export default function CustomLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent border-b-indigo-500 border-l-blue-500 animate-spin"></div>
      </div>
    </div>
  );
}
