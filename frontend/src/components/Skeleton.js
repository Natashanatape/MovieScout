import React from 'react';

export const MovieCardSkeleton = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-96 bg-gray-700"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export const MovieDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-900 animate-pulse">
    <div className="h-96 bg-gray-800"></div>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-96 bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default { MovieCardSkeleton, MovieDetailSkeleton };
