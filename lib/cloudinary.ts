import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type GalleryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
};

/**
 * Fetches gallery images from Cloudinary
 * Can be called server-side to avoid an extra HTTP hop
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const folder = process.env.CLOUDINARY_GALLERY_FOLDER || 'oaks/gallery';

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
      resource_type: 'image',
    });

    // Map and sort by created_at desc (newest first)
    const images: GalleryImage[] = result.resources
      .map((resource: any) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at,
      }))
      .sort((a: GalleryImage, b: GalleryImage) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

/**
 * Builds an optimized Cloudinary URL for an image
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const { width, quality = 'auto', format = 'auto' } = options;

  let transformations = `f_${format},q_${quality}`;
  if (width) {
    transformations += `,w_${width}`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}
