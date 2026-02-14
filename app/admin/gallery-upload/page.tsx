'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

type UploadedImage = {
  public_id: string;
  secure_url: string;
  thumbnail_url: string;
};

export default function GalleryUploadPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Try to access a protected endpoint to check if cookie is set
    try {
      const response = await fetch('/api/cloudinary/sign', { method: 'POST' });
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Not authenticated, show login form
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadWidget = async () => {
    // Get signed upload parameters
    try {
      const response = await fetch('/api/cloudinary/sign', {
        method: 'POST',
      });

      if (!response.ok) {
        setError('Failed to get upload signature');
        return;
      }

      const { timestamp, signature, folder, uploadPreset, cloudName, apiKey } =
        await response.json();

      // @ts-ignore - Cloudinary widget is loaded via script
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder,
          uploadPreset,
          sources: ['local', 'camera'],
          multiple: true,
          maxFiles: 20,
          clientAllowedFormats: ['image'],
          maxImageFileSize: 10000000, // 10MB
          thumbnails: '.upload-thumbnails',
          showAdvancedOptions: false,
          cropping: false,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0E2F5A',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1',
            },
          },
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Upload error:', error);
            setError('Upload failed: ' + error.message);
            return;
          }

          if (result.event === 'success') {
            const image: UploadedImage = {
              public_id: result.info.public_id,
              secure_url: result.info.secure_url,
              thumbnail_url: result.info.thumbnail_url,
            };
            setUploadedImages((prev) => [...prev, image]);
            setUploadCount((prev) => prev + 1);
          }

          if (result.event === 'close') {
            widget.close();
          }
        }
      );

      widget.open();
    } catch (err) {
      console.error('Widget error:', err);
      setError('Failed to open upload widget');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onLoad={() => setCloudinaryLoaded(true)}
      />
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gallery Upload
          </h1>
          <p className="text-gray-600 mb-8">
            Upload images to the gallery. Images will be automatically added to the public gallery.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <button
              onClick={openUploadWidget}
              disabled={!cloudinaryLoaded}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {cloudinaryLoaded ? 'Upload Images' : 'Loading...'}
            </button>
            <div className="upload-thumbnails mt-4"></div>
          </div>

          {uploadCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                Upload Successful!
              </h2>
              <p className="text-green-700 mb-4">
                {uploadCount} {uploadCount === 1 ? 'image' : 'images'} uploaded successfully.
              </p>
              <a
                href="/gallery"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                View Gallery
              </a>
            </div>
          )}

          {uploadedImages.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recently Uploaded
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div key={image.public_id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.thumbnail_url || image.secure_url}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
