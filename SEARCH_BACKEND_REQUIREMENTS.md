# Search Backend Requirements

## Problem
The search functionality is not working because the backend is not returning data in the expected format or the API endpoint is not properly configured.

---

## Required Backend Endpoint

### Search Podcasts
```
GET /api/search
Query Parameters:
  - q: string (required) - The search query
  - limit: number (optional, default: 50) - Maximum results to return

Example Request:
GET /api/search?q=technology&limit=50
```

### Expected Response Format

The backend should return podcasts in one of these formats:

#### Option 1: Direct Array (Simplest)
```json
[
  {
    "id": "podcast_123",
    "title": "AI in 2026",
    "thumbnail": "https://img.youtube.com/vi/abc123/mqdefault.jpg",
    "uploader": "Tech Talk",
    "duration": "45:30",
    "category": "Technology",
    "description": "Discussion about AI trends...",
    "created_at": "2026-02-17T10:00:00Z"
  },
  {
    "id": "podcast_456",
    "title": "Business Insights",
    "thumbnail": "https://...",
    "uploader": "Business Channel",
    "duration": "30:15",
    "category": "Business",
    "description": "...",
    "created_at": "2026-02-16T15:00:00Z"
  }
]
```

#### Option 2: Wrapped in Data Object
```json
{
  "data": [
    {
      "id": "podcast_123",
      "title": "AI in 2026",
      ...
    }
  ]
}
```

#### Option 3: With Metadata
```json
{
  "podcasts": [
    {
      "id": "podcast_123",
      "title": "AI in 2026",
      ...
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 50
}
```

#### Option 4: Nested Data
```json
{
  "data": {
    "podcasts": [
      {
        "id": "podcast_123",
        "title": "AI in 2026",
        ...
      }
    ],
    "total": 42
  }
}
```

---

## Search Logic

### 1. Text Search
Search should match against:
- **Podcast title** (primary)
- **Description** (secondary)
- **Uploader/Channel name**
- **Tags/Keywords**

### 2. Category-Based Search
When user searches for category keywords, return podcasts from that category:

```python
# Backend category mapping
categories = {
    "Tech": ["tech", "programming", "coding", "software", "computer", "ai", "app", "developer", "ቴክኖሎጂ", "ፕሮግራሚንግ"],
    "Business": ["business", "entrepreneur", "money", "investment", "startup", "company", "ቢዝነስ", "ንግድ"],
    "Lifestyle": ["lifestyle", "life", "relationship", "family", "health", "ሕይወት", "የቤት እናት"],
    "Success": ["success", "motivation", "inspiration", "success story", "ስኬት", "ተስፋ"],
    "Education": ["education", "learning", "teach", "school", "university", "ትምህርት"],
    "News": ["news", "ዜና", "current", "today"]
}

def search_podcasts(query):
    # Check if query matches category keywords
    for category, keywords in categories.items():
        if any(keyword.lower() in query.lower() for keyword in keywords):
            # Return podcasts from this category
            return get_podcasts_by_category(category)
    
    # Otherwise, do text search
    return text_search(query)
```

### 3. Multi-language Support
Support both English and Amharic keywords:
- "tech" or "ቴክኖሎጂ" → Tech category
- "business" or "ንግድ" → Business category
- "education" or "ትምህርት" → Education category

---

## Example Implementation (Python/FastAPI)

```python
from fastapi import FastAPI, Query
from typing import List, Optional

app = FastAPI()

# Category keywords
CATEGORIES = {
    "Tech": ["tech", "programming", "coding", "software", "computer", "ai", "app", "developer", "ቴክኖሎጂ", "ፕሮግራሚንግ"],
    "Business": ["business", "entrepreneur", "money", "investment", "startup", "company", "ቢዝነስ", "ንግድ"],
    "Lifestyle": ["lifestyle", "life", "relationship", "family", "health", "ሕይወት", "የቤት እናት"],
    "Success": ["success", "motivation", "inspiration", "success story", "ስኬት", "ተስፋ"],
    "Education": ["education", "learning", "teach", "school", "university", "ትምህርት"],
    "News": ["news", "ዜና", "current", "today"]
}

def detect_category(query: str) -> Optional[str]:
    """Detect if search query matches a category"""
    query_lower = query.lower()
    for category, keywords in CATEGORIES.items():
        if any(keyword.lower() in query_lower for keyword in keywords):
            return category
    return None

@app.get("/api/search")
async def search_podcasts(
    q: str = Query(..., description="Search query"),
    limit: int = Query(50, description="Maximum results")
):
    # Check if query matches a category
    category = detect_category(q)
    
    if category:
        # Search by category
        podcasts = await get_podcasts_by_category(category, limit)
    else:
        # Text search across all fields
        podcasts = await text_search_podcasts(q, limit)
    
    return podcasts

async def get_podcasts_by_category(category: str, limit: int):
    """Get podcasts from database filtered by category"""
    # Query your database/Telegram bot
    # Example with MongoDB:
    # podcasts = await db.podcasts.find({"category": category}).limit(limit).to_list()
    
    # Example with Telegram Bot API:
    # podcasts = fetch_from_telegram_by_category(category, limit)
    
    return podcasts

async def text_search_podcasts(query: str, limit: int):
    """Full text search across podcast fields"""
    # Query your database with text search
    # Example with MongoDB:
    # podcasts = await db.podcasts.find({
    #     "$text": {"$search": query}
    # }).limit(limit).to_list()
    
    # Example with SQL:
    # SELECT * FROM podcasts 
    # WHERE title LIKE %query% OR description LIKE %query% OR uploader LIKE %query%
    # LIMIT limit
    
    return podcasts
```

---

## Testing the Backend

### 1. Test Basic Search
```bash
curl "http://localhost:3000/api/search?q=technology"
```

Expected: Returns podcasts with "technology" in title/description

### 2. Test Category Search
```bash
curl "http://localhost:3000/api/search?q=tech"
```

Expected: Returns all podcasts in Tech category

### 3. Test Amharic Search
```bash
curl "http://localhost:3000/api/search?q=ቴክኖሎጂ"
```

Expected: Returns all podcasts in Tech category

### 4. Test Empty Results
```bash
curl "http://localhost:3000/api/search?q=nonexistentpodcast123"
```

Expected: Returns empty array `[]`

---

## Frontend Configuration

Make sure your `.env` file has the correct backend URL:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Or for production:
```env
VITE_API_BASE_URL=https://your-backend.com/api
```

---

## Debugging Checklist

- [ ] Backend is running and accessible
- [ ] `/api/search` endpoint exists
- [ ] Endpoint accepts `q` query parameter
- [ ] Returns data in one of the expected formats
- [ ] CORS is enabled for frontend domain
- [ ] Category keywords are properly mapped
- [ ] Text search works across title/description
- [ ] Empty search returns empty array (not error)
- [ ] Frontend `.env` has correct `VITE_API_BASE_URL`

---

## Common Issues

### Issue 1: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Enable CORS in backend
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 2: 404 Not Found
```
GET /api/search 404 Not Found
```

**Solution**: Check that endpoint path matches exactly `/api/search`

### Issue 3: Empty Results
```
[]
```

**Solution**: 
- Check if podcasts exist in database
- Verify search query matches podcast data
- Check category mapping

### Issue 4: Wrong Response Format
```
{error: "Invalid format"}
```

**Solution**: Ensure backend returns array of podcast objects, not error messages

---

## Quick Test

Open browser console on the Search page and check:

1. **Network tab**: Look for `/api/search?q=...` request
2. **Response**: Check what data backend is returning
3. **Console logs**: Look for "Search response:" and "Parsed results:"

This will show exactly what the backend is returning and help debug the issue.
