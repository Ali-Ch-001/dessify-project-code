# Categorization API Flow Diagram

## Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    WARDROBE UPLOAD & CATEGORIZATION FLOW              │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. User selects image
       │
       ▼
┌─────────────────────────────┐
│ upload_wardrobe/page.tsx    │
│ - Handle file selection     │
│ - Create preview            │
│ - Build FormData            │
└──────┬──────────────────────┘
       │
       │ 2. POST /api/categorize
       │    FormData { file, user_id }
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│ /api/categorize/route.ts                                            │
│                                                                      │
│  Step 1: Validate Input                                             │
│  ├─ Check file exists                                               │
│  └─ Check user_id provided                                          │
│                                                                      │
│  Step 2: Upload to Storage                                          │
│  ├─ Generate unique filename                                        │
│  ├─ Convert to buffer                                               │
│  └─ Upload to Supabase Storage                                      │
│      ├─ Bucket: "userwardrobe"                                      │
│      └─ Path: "{user_id}/{timestamp}_{uuid}.{ext}"                  │
│                                                                      │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Supabase Storage          │
│   - Store image file        │
│   - Generate public URL     │
└──────┬──────────────────────┘
       │
       │ 3. Public URL returned
       │    https://.../storage/v1/object/public/userwardrobe/...
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│ /api/categorize/route.ts (continued)                                │
│                                                                      │
│  Step 3: AI Categorization (Optional)                               │
│  ├─ Check if NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE exists           │
│  ├─ If yes:                                                         │
│  │  ├─ Connect to Gradio AI service                                │
│  │  ├─ Send image for prediction                                   │
│  │  ├─ Wait for response (30s timeout)                             │
│  │  └─ Extract category from result                                │
│  └─ If no or error: Use "uncategorized"                            │
│                                                                      │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       │ (Optional)
       ▼
┌─────────────────────────────┐
│   AI/ML Service (Gradio)    │
│   - Analyze image           │
│   - Detect clothing type    │
│   - Return category label   │
└──────┬──────────────────────┘
       │
       │ 4. Category result
       │    { data: ["t-shirt"] }
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│ /api/categorize/route.ts (continued)                                │
│                                                                      │
│  Step 4: Save to Database                                           │
│  ├─ Insert into "userwardrobe" table                                │
│  │  ├─ user_id: {userId}                                            │
│  │  ├─ image_url: {publicUrl}                                       │
│  │  └─ category: {category}                                         │
│  ├─ If error: Clean up storage file                                │
│  └─ Return database record                                          │
│                                                                      │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   PostgreSQL (Supabase)     │
│   - Save item record        │
│   - Link to user            │
│   - Store category          │
└──────┬──────────────────────┘
       │
       │ 5. Database record saved
       │    { id, user_id, image_url, category }
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│ /api/categorize/route.ts (final response)                           │
│                                                                      │
│  Step 5: Return Response                                            │
│  └─ JSON {                                                          │
│      success: true,                                                 │
│      id: "uuid",                                                    │
│      image_url: "https://...",                                      │
│      category: "t-shirt"                                            │
│    }                                                                │
│                                                                      │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       │ 6. Response: 200 OK
       │    { success, id, image_url, category }
       │
       ▼
┌─────────────────────────────┐
│ upload_wardrobe/page.tsx    │
│ - Update item status        │
│ - Show success indicator    │
│ - Display category badge    │
└─────────────────────────────┘
       │
       │ 7. UI Update
       │
       ▼
┌─────────────┐
│   Client    │
│  (Browser)  │
│ - Image     │
│   displayed │
│ - Category  │
│   shown     │
└─────────────┘
```

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                         │
└────────────────────────────────────────────────────────────┘

Error at Step 1 (Validation):
├─ Missing file → 400 Bad Request
└─ Missing user_id → 400 Bad Request

Error at Step 2 (Storage Upload):
├─ Storage error → 500 Internal Server Error
└─ Response includes error details

Error at Step 3 (AI Service):
├─ Connection timeout → Fall back to "uncategorized"
├─ Service unavailable → Fall back to "uncategorized"
└─ Invalid response → Fall back to "uncategorized"
    (Note: Non-blocking - does not fail the request)

Error at Step 4 (Database):
├─ Insert error → 500 Internal Server Error
├─ Clean up uploaded file from storage
└─ Response includes error details

Error at Step 5 (Response):
└─ Caught by global try-catch → 500 Internal Server Error
```

## Component Interaction

```
┌──────────────────────────────────────────────────────────┐
│                    SYSTEM COMPONENTS                      │
└──────────────────────────────────────────────────────────┘

Frontend Components:
├─ /app/(dashboard)/upload_wardrobe/page.tsx
│  ├─ File input handler
│  ├─ Webcam capture
│  ├─ Drag & drop zone
│  └─ Upload queue management

API Layer:
└─ /app/api/categorize/route.ts
   ├─ Input validation
   ├─ File handling
   ├─ Storage operations
   ├─ AI service integration
   └─ Database operations

External Services:
├─ Supabase Storage
│  ├─ Bucket: userwardrobe
│  └─ Public access enabled
│
├─ Supabase Database
│  ├─ Table: userwardrobe
│  └─ Columns: id, user_id, image_url, category
│
└─ AI Service (Optional)
   ├─ Platform: Gradio/HuggingFace
   ├─ Endpoint: /predict
   └─ Input: image blob
```

## Data Models

```typescript
// Request
interface CategorizationRequest {
  file: File;        // Image file
  user_id: string;   // UUID of the user
}

// Response (Success)
interface CategorizationResponse {
  success: true;
  id: string;         // UUID of database record
  image_url: string;  // Public URL from storage
  category: string;   // AI-detected or "uncategorized"
}

// Response (Error)
interface CategorizationError {
  error: string;      // Error message
  details?: string;   // Additional details
}

// Database Record
interface WardrobeItem {
  id: string;         // UUID (auto-generated)
  user_id: string;    // UUID of owner
  image_url: string;  // Public storage URL
  category: string;   // Item category
  created_at: Date;   // Auto-timestamp
}
```

## Environment Configuration

```
Required:
├─ NEXT_PUBLIC_SUPABASE_URL
├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
└─ SUPABASE_SERVICE_ROLE_KEY (server-only)

Optional:
└─ NEXT_PUBLIC_AI_CATEGORIZATION_SERVICE
   └─ If not set: Default to "uncategorized"
```

## File Organization

```
project/
├── app/
│   ├── (dashboard)/
│   │   └── upload_wardrobe/
│   │       └── page.tsx ────────────── Frontend upload page
│   └── api/
│       └── categorize/
│           └── route.ts ────────────── API endpoint (NEW)
├── lib/
│   └── supabaseClient.ts ───────────── Supabase client config
├── .env.example ────────────────────── Environment template (NEW)
├── IMPLEMENTATION.md ───────────────── Technical docs (NEW)
└── API_FLOW.md ─────────────────────── This file (NEW)
```
