import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPhotos = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${pageNum}&limit=12`
      );
      
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }
      
      const photosWithUrls = response.data.map(photo => ({
        ...photo,
        thumbnail_url: `https://picsum.photos/id/${photo.id}/300/200`,
        originalUrl: photo?.url || "",
        downloadUrl: photo?.download_url || "",
        info_url: `https://picsum.photos/id/${photo.id}/info`
      }));

      // Kiểm tra trùng lặp và chỉ thêm ảnh mới
      setPhotos(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPhotos = photosWithUrls.filter(photo => !existingIds.has(photo.id));
        return [...prev, ...newPhotos];
      });

      // Nếu không có ảnh mới, dừng infinite scroll
      if (photosWithUrls.length === 0) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(page);
  }, [page, fetchPhotos]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 100
        < document.documentElement.offsetHeight || loading) {
      return;
    }
    
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handlePhotoClick = (photo) => {
    navigate(`/photos/${photo.id}`);
  };

  const handleCopyUrl = (url, e) => {
    e.stopPropagation();
    if (url) {
      navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } else {
      alert('No URL available for this photo');
    }
  };

  const handleRetry = () => {
    setPage(1);
    setPhotos([]);
    setHasMore(true);
    fetchPhotos(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Photos</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-4">
          <p className="text-red-600 mb-3">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={`${photo.id}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handlePhotoClick(photo)}
          >
            <div className="relative pb-[75%]">
              <img
                src={photo.thumbnail_url}
                alt={`Photo by ${photo.author}`}
                className="absolute top-0 left-0 w-full h-full object-cover bg-gray-100"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/300/200?random=${photo.id}`;
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-700 truncate">
                {photo.author}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ID: {photo.id}
              </p>
              <div className="mt-2 space-y-1">
                <button
                  onClick={(e) => handleCopyUrl(photo.originalUrl, e)}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded w-full text-left truncate"
                  title="Click to copy URL"
                >
                  📷 Original URL
                </button>
                <button
                  onClick={(e) => handleCopyUrl(photo.download_url, e)}
                  className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded w-full text-left truncate"
                  title="Click to copy URL"
                >
                  ⬇️ FullView URL
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading more photos...</span>
        </div>
      )}

      {!hasMore && photos.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end of the gallery - {photos.length} photos loaded
        </div>
      )}

      {photos.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No photos found. Try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default PhotoList;