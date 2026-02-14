import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export type GalleryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
};

export async function GET() {
  try {
    const folder = process.env.CLOUDINARY_GALLERY_FOLDER || 'oaks/gallery';

    // Fetch images from Cloudinary
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

    return NextResponse.json(
      { images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
