import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | The Oaks Pub PDX',
  description: 'Check out photos of our pub, food, drinks, and events.',
};

export default function GalleryPage() {
  // Placeholder for gallery images
  const placeholders = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Gallery</h1>
        <p className="text-center text-gray-600 mb-8">
          Take a look around The Oaks Pub PDX
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {placeholders.map((num) => (
            <div
              key={num}
              className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">Photo {num}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Images coming soon. Follow us on Instagram for the latest photos!
        </p>
      </div>
    </div>
  );
}
