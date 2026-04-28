# Firebase Storage CORS Fix

## Problem
Firebase Storage is blocking uploads from localhost due to CORS policy.

## Solution 1: Configure CORS in Firebase Console (Recommended)

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `ethio-podcast-8a2f0`
3. Go to Storage → Rules
4. Update your storage rules to allow uploads:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Go to Storage → Files → Click the three dots → Set CORS configuration
6. Use this CORS configuration:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Solution 2: Use Backend Upload (Alternative)

If you prefer to handle uploads through your backend instead of directly to Firebase Storage, you can:

1. Send the file to your backend API
2. Backend uploads to Firebase Storage (server-side, no CORS issues)
3. Backend returns the download URL

This is more secure and gives you better control over file validation.

## Quick Test

After configuring CORS, clear your browser cache and try uploading again.
