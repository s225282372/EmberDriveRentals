import { useState } from 'react';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const defaultImages = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200',
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
        <img
          src={displayImages[selectedImage]}
          alt={`Car view ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? 'border-primary-600 ring-2 ring-primary-200'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {displayImages.length > 1 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              setSelectedImage((prev) =>
                prev === 0 ? displayImages.length - 1 : prev - 1
              )
            }
            className="btn btn-secondary btn-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <span className="text-sm text-gray-600">
            {selectedImage + 1} / {displayImages.length}
          </span>

          <button
            onClick={() =>
              setSelectedImage((prev) =>
                prev === displayImages.length - 1 ? 0 : prev + 1
              )
            }
            className="btn btn-secondary btn-sm"
          >
            Next
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

