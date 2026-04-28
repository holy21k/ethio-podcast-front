# Backend Requirements for Audio Player Fix

## Problem
The audio player is not working because the backend is returning YouTube embed URLs, which cannot be played in HTML5 audio elements.

## Solution Required

### 1. Audio Streaming Endpoint

Your backend needs to provide **direct audio file URLs** that can be played in HTML5 `<audio>` elements.

#### Option A: Direct File URLs (Recommended)
If you're storing audio files on a CDN or file storage:

```json
GET /api/player/:id

Response:
{
  "data": {
    "streaming_url": "https://your-cdn.com/audio/podcast-123.mp3",
    "title": "Podcast Title",
    "thumbnail": "https://...",
    "duration": "45:30"
  }
}
```

**Supported Audio Formats:**
- `.mp3` (audio/mpeg) - Best compatibility
- `.m4a` (audio/mp4) - Good for iOS
- `.ogg` (audio/ogg) - Good for Firefox
- `.wav` (audio/wav) - Uncompressed

#### Option B: Streaming Proxy (If using Telegram Bot API)
If your audio files are stored in Telegram, create a streaming endpoint:

```python
# Example in Python/Flask
@app.route('/api/stream/<podcast_id>')
def stream_audio(podcast_id):
    # 1. Get file info from Telegram Bot API
    file_info = get_telegram_file(podcast_id)
    
    # 2. Stream the file with proper headers
    def generate():
        # Stream file in chunks
        for chunk in download_telegram_file(file_info):
            yield chunk
    
    return Response(
        generate(),
        mimetype='audio/mpeg',
        headers={
            'Accept-Ranges': 'bytes',
            'Content-Length': str(file_size),
            'Access-Control-Allow-Origin': '*'  # CORS
        }
    )
```

Then return:
```json
{
  "streaming_url": "https://your-backend.com/api/stream/podcast-123"
}
```

### 2. Required HTTP Headers

Your streaming endpoint MUST include these headers:

```
Content-Type: audio/mpeg (or appropriate audio type)
Accept-Ranges: bytes
Content-Length: <file_size>
Access-Control-Allow-Origin: * (or your frontend domain)
```

### 3. Range Request Support

For seeking/scrubbing to work, your endpoint must support HTTP Range requests:

```
Request:
Range: bytes=0-1023

Response:
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/5242880
Content-Length: 1024
```

### 4. Testing

Test your audio URL in browser:
```bash
# Should download/play audio file
curl -I https://your-backend.com/api/stream/podcast-123

# Should return 206 Partial Content
curl -I -H "Range: bytes=0-1023" https://your-backend.com/api/stream/podcast-123
```

### 5. Example Implementation (Python/FastAPI)

```python
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import httpx

app = FastAPI()

@app.get("/api/stream/{podcast_id}")
async def stream_audio(podcast_id: str):
    # Get Telegram file URL
    telegram_file_url = get_telegram_file_url(podcast_id)
    
    # Stream from Telegram
    async with httpx.AsyncClient() as client:
        async with client.stream('GET', telegram_file_url) as response:
            return StreamingResponse(
                response.aiter_bytes(),
                media_type='audio/mpeg',
                headers={
                    'Accept-Ranges': 'bytes',
                    'Access-Control-Allow-Origin': '*'
                }
            )
```

### 6. Alternative: Use Telegram Bot API Direct Links

If your Telegram bot has the files, you can use:
```
https://api.telegram.org/file/bot<BOT_TOKEN>/<file_path>
```

But this requires exposing your bot token, so proxying is recommended.

---

## Current Frontend Implementation

The frontend is already set up to handle audio URLs correctly. Once you fix the backend to return proper audio URLs, the player will work automatically.

**Frontend expects:**
```javascript
// From /api/player/:id endpoint
{
  streaming_url: "https://direct-audio-url.mp3"
}
```

**Frontend audio player supports:**
- Play/Pause
- Seeking/Scrubbing
- Volume control
- Progress tracking
- Playback position saving

---

## Quick Fix Checklist

- [ ] Backend returns direct audio file URLs (not YouTube URLs)
- [ ] Audio URLs are accessible (test in browser)
- [ ] Proper Content-Type header (audio/mpeg, audio/mp4, etc.)
- [ ] CORS headers enabled
- [ ] Range requests supported (for seeking)
- [ ] Test with: `curl -I <your-audio-url>`
