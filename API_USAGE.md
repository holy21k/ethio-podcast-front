# Frontend API Usage Guide

This document shows how to use all the API functions in your React components.

## Import API Functions

```javascript
import {
  // Profile
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateUserInterests,
  
  // Watchlist
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  
  // History
  getHistory,
  addToHistory,
  clearHistory,
  
  // Playback
  getPlaybackPosition,
  savePlaybackPosition,
  
  // Notifications
  getNotificationPreferences,
  updateNotificationPreferences,
  
  // Settings
  getUserSettings,
  updateUserSettings,
  
  // Privacy & Security
  getPrivacySettings,
  updatePrivacySettings,
  getSecurityInfo,
  sendEmailVerification,
  
  // Search History
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
  
  // Support
  getFAQ,
  submitSupportRequest,
  getSupportTickets,
  getAppInfo
} from '../api';
```

## Usage Examples

### Profile Management

```javascript
// Get user profile
const profile = await getUserProfile();
console.log(profile.displayName, profile.email);

// Update profile
await updateUserProfile({
  displayName: "New Name",
  bio: "My bio",
  photoURL: "https://..."
});

// Update interests
await updateUserInterests(["Tech", "Business", "News"]);

// Delete account (with confirmation)
if (confirm('Delete account? This cannot be undone!')) {
  await deleteUserAccount();
  // Redirect to login
}
```

### Watchlist

```javascript
// Get watchlist
const watchlist = await getWatchlist();
watchlist.forEach(item => {
  console.log(item.title);
});

// Add to watchlist
await addToWatchlist(podcastId, {
  title: podcast.title,
  thumbnail: podcast.thumbnail,
  uploader: podcast.uploader
});

// Remove from watchlist
await removeFromWatchlist(podcastId);
```

### Listening History

```javascript
// Get history
const history = await getHistory(20); // Last 20 items

// Add to history (when user plays a podcast)
await addToHistory(podcastId, {
  title: podcast.title,
  thumbnail: podcast.thumbnail
}, currentTime);

// Clear all history
await clearHistory();
```

### Playback Position

```javascript
// Save position (every 5 seconds while playing)
setInterval(() => {
  if (isPlaying) {
    await savePlaybackPosition(podcastId, currentTime);
  }
}, 5000);

// Get saved position (when loading podcast)
const saved = await getPlaybackPosition(podcastId);
if (saved.position > 0) {
  player.seekTo(saved.position);
}
```

### Notifications

```javascript
// Get preferences
const prefs = await getNotificationPreferences();

// Update preferences
await updateNotificationPreferences({
  newPodcasts: true,
  channelUpdates: false,
  email: true,
  push: true
});

// Toggle single preference
const current = await getNotificationPreferences();
await updateNotificationPreferences({
  ...current,
  email: !current.email
});
```

### Settings

```javascript
// Get settings
const settings = await getUserSettings();

// Update theme
await updateUserSettings({
  theme: "dark"
});

// Update playback speed
await updateUserSettings({
  playbackSpeed: 1.5
});

// Update multiple settings
await updateUserSettings({
  theme: "dark",
  autoplay: true,
  quality: "high",
  language: "am"
});
```

### Privacy & Security

```javascript
// Get privacy settings
const privacy = await getPrivacySettings();

// Update privacy
await updatePrivacySettings({
  profileVisibility: "private",
  showHistory: false,
  showWatchlist: false
});

// Get security info
const security = await getSecurityInfo();
console.log('Email verified:', security.emailVerified);
console.log('Last sign in:', security.lastSignIn);

// Send verification email
await sendEmailVerification();
alert('Verification email sent!');
```

### Search History

```javascript
// Get recent searches
const searches = await getSearchHistory(10);

// Add search (when user searches)
await addToSearchHistory("ethiopian news", 15); // 15 results

// Clear search history
await clearSearchHistory();
```

### Support

```javascript
// Get FAQ
const faq = await getFAQ();
faq.forEach(item => {
  console.log(item.question, item.answer);
});

// Submit support ticket
await submitSupportRequest({
  subject: "Bug Report",
  message: "I found a bug when...",
  category: "technical"
});

// Get user's tickets
const tickets = await getSupportTickets();

// Get app info
const info = await getAppInfo();
console.log(info.version, info.contact.email);
```

## Complete Component Examples

### Settings Page

```javascript
import { useState, useEffect } from 'react';
import {
  getUserSettings,
  updateUserSettings,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../api';

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const [settingsData, notifData] = await Promise.all([
        getUserSettings(),
        getNotificationPreferences()
      ]);
      setSettings(settingsData);
      setNotifications(notifData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleThemeChange(theme) {
    try {
      await updateUserSettings({ theme });
      setSettings({ ...settings, theme });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }

  async function toggleNotification(key) {
    try {
      const updated = { ...notifications, [key]: !notifications[key] };
      await updateNotificationPreferences(updated);
      setNotifications(updated);
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Settings</h1>
      
      <section>
        <h2>Theme</h2>
        <select value={settings.theme} onChange={(e) => handleThemeChange(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </section>

      <section>
        <h2>Notifications</h2>
        <label>
          <input
            type="checkbox"
            checked={notifications.newPodcasts}
            onChange={() => toggleNotification('newPodcasts')}
          />
          New Podcasts
        </label>
        <label>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => toggleNotification('email')}
          />
          Email Notifications
        </label>
      </section>
    </div>
  );
}
```

### Profile Page

```javascript
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function handleSave() {
    try {
      await updateUserProfile(formData);
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      
      {editing ? (
        <div>
          <input
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="Display Name"
          />
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Bio"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{profile.displayName}</h2>
          <p>{profile.bio}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}
```

### Support Page

```javascript
import { useState, useEffect } from 'react';
import { getFAQ, submitSupportRequest, getSupportTickets } from '../api';

function SupportPage() {
  const [faq, setFaq] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [faqData, ticketsData] = await Promise.all([
        getFAQ(),
        getSupportTickets()
      ]);
      setFaq(faqData);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading support data:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await submitSupportRequest(formData);
      alert('Support request submitted!');
      setShowForm(false);
      setFormData({ subject: '', message: '', category: 'general' });
      loadData(); // Reload tickets
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  }

  return (
    <div>
      <h1>Help & Support</h1>

      <section>
        <h2>FAQ</h2>
        {faq.map(item => (
          <div key={item.id}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Your Support Tickets</h2>
        {tickets.map(ticket => (
          <div key={ticket.id}>
            <h3>{ticket.subject}</h3>
            <p>Status: {ticket.status}</p>
            <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </section>

      <section>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Submit New Request'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Subject"
              required
            />
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your issue..."
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="feedback">Feedback</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        )}
      </section>
    </div>
  );
}
```

## Error Handling

All API functions throw errors that should be caught:

```javascript
try {
  const data = await getUserProfile();
  // Success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Server error:', error.response.data.message);
    alert(error.response.data.message);
  } else if (error.request) {
    // No response from server
    console.error('Network error');
    alert('Network error. Please check your connection.');
  } else {
    // Other error
    console.error('Error:', error.message);
    alert('An error occurred');
  }
}
```

## Authentication

All authenticated endpoints automatically include the Firebase token from the axios interceptor in `config.js`. Make sure the user is logged in before calling these functions.

```javascript
import { auth } from '../services/firebase';

// Check if user is logged in
if (auth.currentUser) {
  // User is logged in, safe to call API
  const profile = await getUserProfile();
} else {
  // Redirect to login
  navigate('/login');
}
```

## Best Practices

1. **Loading States**: Always show loading indicators
2. **Error Handling**: Catch and display errors to users
3. **Optimistic Updates**: Update UI immediately, revert on error
4. **Debouncing**: Debounce frequent updates (like playback position)
5. **Caching**: Cache data in state to avoid unnecessary API calls

```javascript
// Example: Debounced playback position save
import { debounce } from 'lodash';

const savePosition = debounce(async (podcastId, position) => {
  try {
    await savePlaybackPosition(podcastId, position);
  } catch (error) {
    console.error('Error saving position:', error);
  }
}, 5000); // Save every 5 seconds

// Usage
useEffect(() => {
  if (isPlaying) {
    savePosition(podcastId, currentTime);
  }
}, [currentTime]);
```
