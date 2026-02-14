import type { Metadata } from 'next';
import { getGalleryImages, buildCloudinaryUrl } from '@/lib/cloudinary';

export const metadata: Metadata = {
  title: 'Gallery | The Oaks Pub PDX',
  description: 'Check out photos of our pub, food, drinks, and events.',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Gallery</h1>
        <p className="text-center text-gray-600 mb-8">
          Take a look around The Oaks Pub PDX
        </p>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No images in the gallery yet. Check back soon!
            </p>
            <p className="text-sm text-gray-400">
              Follow us on Instagram for the latest photos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.public_id}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={buildCloudinaryUrl(image.public_id, { width: 800 })}
                  alt="Gallery image"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
