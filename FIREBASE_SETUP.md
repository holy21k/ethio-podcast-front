# Firebase Configuration Required

The application is failing to start because the Firebase API keys are missing.

## Action Required

1.  Open `src/services/firebase.js`.
2.  Locate the `firebaseConfig` object.
3.  Replace the placeholder values (`API_KEY`, `PROJECT_ID`, etc.) with your actual Firebase project configuration.
    *   You can find these in the Firebase Console > Project Settings.

```javascript
// src/services/firebase.js

const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY", // <--- Update this
    authDomain: "your-project.firebaseapp.com", // <--- Update this
    projectId: "your-project-id", // <--- Update this
    storageBucket: "your-project.firebasestorage.app", // <--- Update this
    messagingSenderId: "your-sender-id", // <--- Update this
    appId: "your-app-id" // <--- Update this
};
```

4.  Save the file.
5.  Restart the server: `npm run dev`.
