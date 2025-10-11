# Categorization API Implementation

## Overview

This document describes the implementation of the wardrobe upload and categorization API endpoint as per the system architecture flow diagram.

## Implementation Summary

### New Files Created

1. **`/app/api/categorize/route.ts`** - Main API endpoint
2. **`.env.example`** - Environment variables template

### Files Modified

1. **`/app/(dashboard)/upload_wardrobe/page.tsx`** - Updated to use new API endpoint
2. **`README.md`** - Added API documentation
3. **`.gitignore`** - Updated to include .env.example

## API Endpoint Details

### Endpoint: `POST /api/categorize`

**Purpose:** Handle image upload, storage, AI categorization, and database persistence for wardrobe items.

**Request Format:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body Parameters:
  - `file` (File): Image file to upload
  - `user_id` (string): User's UUID

**Response Format:**
```json
{
  "success": true,
  "id": "uuid-of-database-record",
  "image_url": "https://...supabase.co/storage/v1/object/public/userwardrobe/...",
  "category": "t-shirt"
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "details": "Additional error details"
}
```

## Flow Implementation

The implementation follows this 5-step flow as described in the problem statement:

### Step 1: Upload to Storage
- Accepts image file via FormData
- Generates unique filename: `{user_id}/{timestamp}_{uuid}.{ext}`
- Uploads to Supabase Storage bucket `userwardrobe`
- Handles upload errors with proper cleanup

### Step 2: Get Public URL
- Retrieves public URL from Supabase Storage
- URL format: `https://{project}.supabase.co/storage/v1/object/public/userwardrobe/{path}`

### Step 3: Call AI Service (Optional)
- Checks for `NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE` environment variable
- If configured, connects to Gradio-based AI service
- Sends image for categorization with 30-second timeout
- Falls back to "uncategorized" if AI service fails or is not configured
- Uses same pattern as existing `/api/tryon` and `/api/remove-background` endpoints

### Step 4: Save to Database
- Inserts record into `userwardrobe` table with:
  - `user_id`: UUID of the user
  - `image_url`: Public URL from storage
  - `category`: AI-determined category or "uncategorized"
- Cleans up storage file if database insert fails
- Returns full database record

### Step 5: Return Response
- Returns JSON with success status, record ID, image URL, and category
- Client updates UI with categorized item

## Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations)

### Optional
- `NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE`: Gradio AI service URL for categorization
  - If not set, items will be categorized as "uncategorized"
  - Format: `https://your-space.hf.space` (Hugging Face Space URL)

## Database Schema

The implementation uses the existing `userwardrobe` table with the following structure:

```sql
CREATE TABLE userwardrobe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Storage bucket: `userwardrobe`
- Public read access
- Organized by user_id subdirectories

## Integration

### Frontend Integration

The upload wardrobe page (`/app/(dashboard)/upload_wardrobe/page.tsx`) has been updated to use the new API endpoint:

```typescript
const API_URL = '/api/categorize';

const uploadItem = async (item: UploadItem) => {
  const form = new FormData();
  form.append('user_id', userId);
  form.append('file', item.file);
  const res = await fetch(API_URL, { method: 'POST', body: form });
  const body = await res.json();
  // Handle response with category
};
```

### Error Handling

The implementation includes comprehensive error handling:
1. Input validation (file and user_id required)
2. Storage upload errors with detailed messages
3. AI service errors with graceful fallback
4. Database errors with storage cleanup
5. Global try-catch with error logging

### Security Considerations

1. **Server-Side API**: Endpoint runs on server, using service role key
2. **User Authentication**: Requires valid user_id (should be validated against authenticated user)
3. **File Type Validation**: Accepts image files (validated by client, should add server-side validation)
4. **Storage Isolation**: Files organized by user_id to prevent unauthorized access
5. **Error Messages**: Generic errors returned to client, detailed logs on server

## Future Enhancements

1. **Server-side file validation**: Verify file type and size on server
2. **Image optimization**: Resize/compress images before storage
3. **Rate limiting**: Prevent abuse of upload endpoint
4. **Batch upload**: Support multiple files in single request
5. **Category refinement**: Support manual category override
6. **Duplicate detection**: Check for similar images before upload
7. **Progress tracking**: WebSocket or SSE for upload progress

## Testing

### Manual Testing Steps

1. Set up environment variables in `.env.local`
2. Start development server: `npm run dev`
3. Navigate to upload wardrobe page (requires authentication)
4. Upload an image file
5. Verify:
   - File appears in Supabase Storage under `userwardrobe/{user_id}/`
   - Record created in `userwardrobe` table
   - Category displayed in UI (or "uncategorized" if no AI service)
   - Image accessible via public URL

### With AI Service

1. Deploy or use existing Gradio space for clothing categorization
2. Set `NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE` to space URL
3. Upload test images
4. Verify category predictions are returned and saved

## Deployment Notes

1. Ensure Supabase project has:
   - `userwardrobe` storage bucket created and configured as public
   - `userwardrobe` table created with proper schema
   - RLS policies configured (if needed)

2. Set environment variables in deployment platform:
   - All required Supabase variables
   - Optional AI service URL

3. Monitor logs for:
   - Storage upload failures
   - AI service timeouts
   - Database insertion errors

## References

- Supabase Storage: https://supabase.com/docs/guides/storage
- Gradio Client: https://www.gradio.app/guides/getting-started-with-the-python-client
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
