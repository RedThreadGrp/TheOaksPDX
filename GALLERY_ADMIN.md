# Gallery Admin - Cloudinary Upload System

This document explains how to use the new Cloudinary-based gallery system for The Oaks Pub PDX website.

## Features

- **Admin Upload Page**: Password-protected page for uploading images
- **Cloudinary Integration**: Images stored in Cloudinary cloud storage
- **Auto-Gallery**: Uploaded images automatically appear on the gallery page
- **No Google Sheets**: Direct Cloudinary integration, no spreadsheet needed

## Setup

### 1. Environment Variables

Make sure the following environment variables are set in Vercel (or `.env.local` for local development):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_actual_secret_here
CLOUDINARY_GALLERY_FOLDER=oaks/gallery
CLOUDINARY_UPLOAD_PRESET=oaks_gallery_signed
OAKS_ADMIN_PASSWORD=your_admin_password
OAKS_TZ=America/Los_Angeles
```

### 2. Cloudinary Upload Preset

Create an upload preset in Cloudinary:

1. Go to Settings > Upload
2. Create a new upload preset named `oaks_gallery_signed`
3. Set it to "Signed" mode
4. Set folder to `oaks/gallery`

## Usage

### Uploading Images

1. Navigate to: `https://theoakspubpdx.com/admin/gallery-upload`
2. Enter the admin password
3. Click "Upload Images"
4. Select images from your computer (max 20 images, 10MB each)
5. Wait for uploads to complete
6. Click "View Gallery" to see the results

### Viewing the Gallery

- Public gallery: `https://theoakspubpdx.com/gallery`
- Images are automatically fetched from Cloudinary
- Gallery updates every 5 minutes (cached for performance)

## API Endpoints

### POST /api/admin/login
Login with admin password, sets `oaks_admin` cookie.

**Request:**
```json
{
  "password": "your_admin_password"
}
```

**Response:**
```json
{
  "success": true
}
```

### POST /api/cloudinary/sign
Get signed upload parameters (requires admin cookie).

**Response:**
```json
{
  "timestamp": 1234567890,
  "signature": "abc123...",
  "folder": "oaks/gallery",
  "uploadPreset": "oaks_gallery_signed",
  "cloudName": "your_cloud_name",
  "apiKey": "your_api_key"
}
```

### GET /api/gallery
Fetch all gallery images from Cloudinary.

**Response:**
```json
{
  "images": [
    {
      "public_id": "oaks/gallery/image1",
      "secure_url": "https://res.cloudinary.com/...",
      "width": 1920,
      "height": 1080,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Architecture

- **Admin Authentication**: Simple password-based auth with httpOnly cookies (valid 24 hours)
- **Image Storage**: Cloudinary (folder: `oaks/gallery`)
- **Gallery Page**: Server-side rendered (SSR) with 5-minute revalidation
- **Upload Widget**: Cloudinary Upload Widget loaded only on admin page
- **Image Optimization**: Automatic format conversion (f_auto) and quality optimization (q_auto)

## Security

- Admin password protected upload page
- Signed uploads to Cloudinary
- HttpOnly cookies for session management
- Rate limiting on upload widget (max 20 files)
- Image format and size validation

## Troubleshooting

**"Unauthorized" error on upload page:**
- Make sure you're logged in with the correct password
- Check that `OAKS_ADMIN_PASSWORD` is set in environment variables

**Images not appearing in gallery:**
- Check that uploads are going to the correct folder (`oaks/gallery`)
- Wait up to 5 minutes for cache to refresh
- Verify environment variables are set correctly

**Upload widget not loading:**
- Check browser console for errors
- Ensure Cloudinary script is loading (check network tab)
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Maintenance

**To delete images:**
1. Go to Cloudinary dashboard
2. Navigate to Media Library > oaks/gallery
3. Select and delete images

**To change admin password:**
1. Update `OAKS_ADMIN_PASSWORD` environment variable in Vercel
2. Redeploy or wait for next deployment
