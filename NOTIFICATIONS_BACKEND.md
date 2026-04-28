# Notifications Backend Requirements

## Overview
Implement a real-time notification system to keep users engaged with new episodes, updates, and personalized alerts.

---

## 1. Notification Types

### A. New Episode Notifications
When a channel the user follows releases a new episode:
```json
{
  "type": "new_episode",
  "title": "New Episode Available",
  "message": "Tech Talk just released: 'AI in 2026'",
  "podcast_id": "abc123",
  "channel": "Tech Talk",
  "thumbnail": "https://...",
  "timestamp": "2026-02-17T10:30:00Z",
  "read": false
}
```

### B. Recommendation Notifications
Personalized podcast recommendations:
```json
{
  "type": "recommendation",
  "title": "You Might Like This",
  "message": "Based on your interests: 'Future of Technology'",
  "podcast_id": "xyz789",
  "reason": "Similar to podcasts you've listened to",
  "timestamp": "2026-02-17T09:00:00Z",
  "read": false
}
```

### C. Engagement Notifications
User engagement reminders:
```json
{
  "type": "engagement",
  "title": "Continue Listening",
  "message": "You left off at 15:30 in 'Business Insights'",
  "podcast_id": "def456",
  "position": 930,
  "timestamp": "2026-02-17T08:00:00Z",
  "read": false
}
```

### D. System Notifications
App updates and announcements:
```json
{
  "type": "system",
  "title": "New Features Available",
  "message": "Check out our new personalization settings!",
  "action_url": "/settings/personalization",
  "timestamp": "2026-02-17T07:00:00Z",
  "read": false
}
```

---

## 2. Required API Endpoints

### Get User Notifications
```
GET /api/notifications
Query Parameters:
  - limit: number (default: 50)
  - offset: number (default: 0)
  - unread_only: boolean (default: false)

Response:
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "new_episode",
      "title": "New Episode Available",
      "message": "...",
      "podcast_id": "abc123",
      "thumbnail": "https://...",
      "timestamp": "2026-02-17T10:30:00Z",
      "read": false,
      "action_url": "/podcast/abc123"
    }
  ],
  "unread_count": 5,
  "total": 42
}
```

### Mark Notification as Read
```
PUT /api/notifications/:id/read

Response:
{
  "success": true,
  "notification_id": "notif_123"
}
```

### Mark All as Read
```
PUT /api/notifications/read-all

Response:
{
  "success": true,
  "marked_count": 5
}
```

### Delete Notification
```
DELETE /api/notifications/:id

Response:
{
  "success": true
}
```

### Get Unread Count
```
GET /api/notifications/unread-count

Response:
{
  "count": 5
}
```

### Update Notification Preferences
```
PUT /api/user/notification-preferences

Body:
{
  "new_episodes": true,
  "recommendations": true,
  "engagement_reminders": false,
  "system_updates": true,
  "email_notifications": false,
  "push_notifications": true
}

Response:
{
  "success": true,
  "preferences": { ... }
}
```

### Get Notification Preferences
```
GET /api/user/notification-preferences

Response:
{
  "new_episodes": true,
  "recommendations": true,
  "engagement_reminders": false,
  "system_updates": true,
  "email_notifications": false,
  "push_notifications": true
}
```

---

## 3. Real-Time Notifications (Optional)

### WebSocket Implementation
```javascript
// Connect to WebSocket
ws://your-backend.com/ws/notifications?token=<auth_token>

// Server sends new notifications
{
  "event": "new_notification",
  "data": {
    "id": "notif_456",
    "type": "new_episode",
    "title": "...",
    "message": "...",
    "timestamp": "2026-02-17T11:00:00Z"
  }
}

// Client acknowledges
{
  "event": "notification_received",
  "notification_id": "notif_456"
}
```

### Alternative: Server-Sent Events (SSE)
```
GET /api/notifications/stream
Headers: Authorization: Bearer <token>

Server sends:
event: notification
data: {"id": "notif_456", "type": "new_episode", ...}
```

---

## 4. Notification Triggers

### When to Send Notifications

1. **New Episode Released**
   - Trigger: New podcast added to followed channel
   - Timing: Immediately after upload
   - Condition: User has "new_episodes" enabled

2. **Personalized Recommendation**
   - Trigger: ML model identifies relevant podcast
   - Timing: Daily batch (morning)
   - Condition: User has "recommendations" enabled

3. **Continue Listening Reminder**
   - Trigger: User hasn't finished a podcast in 24 hours
   - Timing: Next day, same time
   - Condition: User has "engagement_reminders" enabled

4. **Weekly Summary**
   - Trigger: End of week
   - Timing: Sunday evening
   - Content: Top podcasts, listening stats

---

## 5. Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type ENUM('new_episode', 'recommendation', 'engagement', 'system'),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  podcast_id VARCHAR(255),
  thumbnail VARCHAR(500),
  action_url VARCHAR(500),
  metadata JSON,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_user_read (user_id, read),
  INDEX idx_created_at (created_at)
);
```

### Notification Preferences Table
```sql
CREATE TABLE notification_preferences (
  user_id VARCHAR(255) PRIMARY KEY,
  new_episodes BOOLEAN DEFAULT TRUE,
  recommendations BOOLEAN DEFAULT TRUE,
  engagement_reminders BOOLEAN DEFAULT TRUE,
  system_updates BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 6. Push Notifications (Mobile/Web)

### Web Push (Service Worker)
```javascript
// Backend: Send web push
const webpush = require('web-push');

webpush.sendNotification(subscription, JSON.stringify({
  title: 'New Episode Available',
  body: 'Tech Talk just released: AI in 2026',
  icon: '/icon.png',
  badge: '/badge.png',
  data: {
    url: '/podcast/abc123'
  }
}));
```

### Firebase Cloud Messaging (FCM)
```json
POST https://fcm.googleapis.com/fcm/send
Headers:
  Authorization: key=<SERVER_KEY>
  Content-Type: application/json

Body:
{
  "to": "<device_token>",
  "notification": {
    "title": "New Episode Available",
    "body": "Tech Talk just released: AI in 2026",
    "icon": "https://...",
    "click_action": "/podcast/abc123"
  },
  "data": {
    "podcast_id": "abc123",
    "type": "new_episode"
  }
}
```

---

## 7. Email Notifications (Optional)

### Email Template
```html
Subject: New Episode: {{podcast_title}}

<html>
  <body>
    <h2>{{channel_name}} just released a new episode!</h2>
    <img src="{{thumbnail}}" alt="{{podcast_title}}" />
    <h3>{{podcast_title}}</h3>
    <p>{{description}}</p>
    <a href="{{app_url}}/podcast/{{podcast_id}}">Listen Now</a>
  </body>
</html>
```

---

## 8. Implementation Priority

### Phase 1 (MVP)
- [ ] Basic notification storage and retrieval
- [ ] New episode notifications
- [ ] Mark as read functionality
- [ ] Unread count badge

### Phase 2
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Notification preferences
- [ ] Recommendation notifications

### Phase 3
- [ ] Push notifications (Web/Mobile)
- [ ] Email notifications
- [ ] Engagement reminders
- [ ] Weekly summaries

---

## 9. Testing Checklist

- [ ] Create notification for user
- [ ] Retrieve notifications list
- [ ] Mark notification as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Get unread count
- [ ] Update preferences
- [ ] Real-time delivery (if implemented)
- [ ] Push notification delivery (if implemented)

---

## 10. Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own notifications
3. **Rate Limiting**: Prevent notification spam
4. **Data Privacy**: Don't expose other users' data in notifications
5. **XSS Prevention**: Sanitize notification content before display
