import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = requireAdmin(request);
  if (authError) {
    return authError;
  }

  try {
    // Validate required environment variables
    if (!process.env.CLOUDINARY_UPLOAD_PRESET) {
      console.error('CLOUDINARY_UPLOAD_PRESET environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error: upload preset not configured' },
        { status: 500 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = process.env.CLOUDINARY_GALLERY_FOLDER || 'oaks/gallery';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        upload_preset: uploadPreset,
      },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return NextResponse.json({
      timestamp,
      signature,
      folder,
      uploadPreset,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Cloudinary signing error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
