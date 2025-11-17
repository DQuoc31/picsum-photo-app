import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoDetails, setPhotoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://picsum.photos/id/${id}/info`
        );
        setPhotoDetails(response.data);
      } catch (err) {
        console.error('Error fetching photo details:', err);
        setError('Failed to load photo details. The photo might not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhotoDetail();
    }
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Tạo URL đầy đủ từ ID
  const getPhotoUrls = () => {
  return {
    originalUrl: photoDetails?.url || "",
    fullViewUrl: photoDetails?.download_url || "",
    imageUrl: imageError 
      ? `https://picsum.photos/800/600?random=${id}`
      : `https://picsum.photos/id/${id}/800/600`,
    infoUrl: `https://picsum.photos/id/${id}/info`
  };
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading photo details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleBack}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const displayPhoto = photoDetails;
  const urls = getPhotoUrls();

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors flex items-center"
      >
        ← Back to Gallery
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100">
          {imageError ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <div className="text-5xl mb-4">📷</div>
              <p>Could not load image</p>
            </div>
          ) : (
            <img
              src={urls.imageUrl}
              alt={`Photo by ${displayPhoto?.author || 'Unknown'}`}
              className="w-full h-auto max-h-96 object-cover"
              onError={handleImageError}
            />
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {displayPhoto?.title || `Photo by ${displayPhoto?.author || 'Unknown'}`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Author</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {displayPhoto?.author || 'Unknown'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Dimensions</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {displayPhoto?.width || 'Unknown'} × {displayPhoto?.height || 'Unknown'} pixels
              </p>
            </div>
          </div>

          {/* Hiển thị URL section */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">URLs</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Original URL:</p>
                <a 
                  href={urls.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all text-sm bg-gray-50 p-2 rounded block"
                >
                  {urls.originalUrl}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">FullView URL:</p>
                <a 
                  href={urls.fullViewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all text-sm bg-gray-50 p-2 rounded block"
                >
                  {urls.fullViewUrl}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Info URL:</p>
                <a 
                  href={urls.infoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all text-sm bg-gray-50 p-2 rounded block"
                >
                  {urls.infoUrl}
                </a>
              </div>
            </div>
          </div>

          {displayPhoto?.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {displayPhoto.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <a
              href={urls.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              View Original
            </a>
            <a
              href={urls.fullViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              FullView
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(urls.originalUrl);
                alert('URL copied to clipboard!');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Copy URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;