# Personalization Backend Requirements

## Overview
Implement intelligent personalization features to provide users with tailored podcast recommendations and customized content discovery.

---

## 1. User Preference Data Collection

### A. Explicit Preferences
Data users directly provide:
```json
{
  "interests": ["Technology", "Business", "Education"],
  "favorite_channels": ["@techtalk", "@businessinsights"],
  "preferred_duration": "30-60",  // minutes
  "preferred_language": "en",
  "content_rating": "all"  // all, family-friendly, mature
}
```

### B. Implicit Behavior Data
Data collected from user actions:
```json
{
  "listening_history": [
    {
      "podcast_id": "abc123",
      "category": "Technology",
      "duration_listened": 1800,  // seconds
      "completion_rate": 0.85,
      "timestamp": "2026-02-17T10:00:00Z"
    }
  ],
  "search_queries": ["AI", "machine learning", "startups"],
  "watchlist": ["xyz789", "def456"],
  "skipped_podcasts": ["ghi789"],
  "interaction_patterns": {
    "preferred_time": "morning",  // morning, afternoon, evening
    "session_duration": 45,  // average minutes
    "discovery_method": "search"  // search, browse, recommendations
  }
}
```

---

## 2. Required API Endpoints

### Get Personalized Recommendations
```
GET /api/personalization/recommendations
Query Parameters:
  - limit: number (default: 20)
  - category: string (optional)
  - exclude_listened: boolean (default: true)

Response:
{
  "recommendations": [
    {
      "podcast_id": "abc123",
      "title": "AI in 2026",
      "thumbnail": "https://...",
      "category": "Technology",
      "uploader": "Tech Talk",
      "duration": "45:30",
      "match_score": 0.92,
      "reason": "Based on your interest in Technology",
      "tags": ["AI", "Future", "Innovation"]
    }
  ],
  "algorithm": "collaborative_filtering",
  "generated_at": "2026-02-17T10:00:00Z"
}
```

### Get Similar Podcasts
```
GET /api/personalization/similar/:podcast_id
Query Parameters:
  - limit: number (default: 10)

Response:
{
  "similar_podcasts": [
    {
      "podcast_id": "xyz789",
      "title": "Machine Learning Basics",
      "similarity_score": 0.88,
      "reason": "Similar topic and audience"
    }
  ]
}
```

### Get Trending for User
```
GET /api/personalization/trending
Query Parameters:
  - timeframe: string (today, week, month)
  - limit: number (default: 20)

Response:
{
  "trending": [
    {
      "podcast_id": "def456",
      "title": "Startup Stories",
      "trending_score": 0.95,
      "category": "Business",
      "listen_count": 15420,
      "growth_rate": 2.3,
      "personalized": true,
      "reason": "Popular in your interests"
    }
  ]
}
```

### Update User Interests
```
PUT /api/personalization/interests

Body:
{
  "interests": ["Technology", "Business", "Health"],
  "add": ["Science"],
  "remove": ["Sports"]
}

Response:
{
  "success": true,
  "interests": ["Technology", "Business", "Health", "Science"]
}
```

### Get User Listening Stats
```
GET /api/personalization/stats
Query Parameters:
  - period: string (week, month, year, all)

Response:
{
  "total_listening_time": 18000,  // seconds
  "podcasts_completed": 42,
  "favorite_categories": [
    {"category": "Technology", "count": 15, "percentage": 35.7},
    {"category": "Business", "count": 12, "percentage": 28.6}
  ],
  "favorite_channels": [
    {"channel": "@techtalk", "count": 8},
    {"channel": "@businessinsights", "count": 6}
  ],
  "listening_patterns": {
    "most_active_day": "Monday",
    "most_active_time": "morning",
    "average_session": 45,
    "completion_rate": 0.78
  },
  "streak": {
    "current": 7,
    "longest": 15
  }
}
```

### Get Personalized Feed
```
GET /api/personalization/feed
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  "feed": [
    {
      "type": "recommendation",
      "title": "Recommended for You",
      "podcasts": [...]
    },
    {
      "type": "continue_listening",
      "title": "Continue Listening",
      "podcasts": [...]
    },
    {
      "type": "new_from_favorites",
      "title": "New from Your Favorites",
      "podcasts": [...]
    },
    {
      "type": "trending_in_interests",
      "title": "Trending in Technology",
      "podcasts": [...]
    }
  ]
}
```

### Track User Interaction
```
POST /api/personalization/track

Body:
{
  "event": "podcast_played",
  "podcast_id": "abc123",
  "metadata": {
    "source": "recommendation",
    "position": 0,
    "duration_listened": 1800
  },
  "timestamp": "2026-02-17T10:00:00Z"
}

Response:
{
  "success": true,
  "tracked": true
}
```

### Get Discovery Queue
```
GET /api/personalization/discovery-queue
Query Parameters:
  - limit: number (default: 50)

Response:
{
  "queue": [
    {
      "podcast_id": "abc123",
      "title": "AI in 2026",
      "reason": "New in Technology",
      "priority": 1,
      "added_at": "2026-02-17T10:00:00Z"
    }
  ],
  "refresh_available": true,
  "last_refreshed": "2026-02-17T09:00:00Z"
}
```

---

## 3. Recommendation Algorithms

### A. Content-Based Filtering
Match podcasts based on content similarity:
```python
def content_based_recommendations(user_id):
    # Get user's listening history
    history = get_user_history(user_id)
    
    # Extract features: categories, tags, channels
    user_profile = extract_features(history)
    
    # Find similar podcasts
    candidates = find_similar_content(user_profile)
    
    # Rank by similarity score
    return rank_by_similarity(candidates, user_profile)
```

### B. Collaborative Filtering
Recommend based on similar users:
```python
def collaborative_filtering(user_id):
    # Find users with similar listening patterns
    similar_users = find_similar_users(user_id)
    
    # Get podcasts they liked
    recommendations = get_liked_by_similar_users(similar_users)
    
    # Filter out already listened
    new_recommendations = filter_listened(recommendations, user_id)
    
    return rank_by_popularity(new_recommendations)
```

### C. Hybrid Approach (Recommended)
Combine multiple signals:
```python
def hybrid_recommendations(user_id):
    # Get recommendations from different sources
    content_recs = content_based_recommendations(user_id)
    collab_recs = collaborative_filtering(user_id)
    trending_recs = get_trending_in_interests(user_id)
    
    # Weighted combination
    final_recs = combine_with_weights({
        'content': (content_recs, 0.4),
        'collaborative': (collab_recs, 0.3),
        'trending': (trending_recs, 0.2),
        'diversity': (diverse_recs, 0.1)
    })
    
    return final_recs
```

---

## 4. Database Schema

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  user_id VARCHAR(255) PRIMARY KEY,
  interests JSON,  -- ["Technology", "Business"]
  favorite_channels JSON,  -- ["@techtalk"]
  preferred_duration VARCHAR(50),
  preferred_language VARCHAR(10),
  content_rating VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Interactions Table
```sql
CREATE TABLE user_interactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  podcast_id VARCHAR(255) NOT NULL,
  event_type ENUM('played', 'completed', 'skipped', 'saved', 'shared'),
  duration_listened INT,  -- seconds
  completion_rate DECIMAL(3,2),
  source VARCHAR(100),  -- recommendation, search, browse
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_podcast_id (podcast_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

### Recommendation Cache Table
```sql
CREATE TABLE recommendation_cache (
  user_id VARCHAR(255) PRIMARY KEY,
  recommendations JSON,  -- Array of podcast IDs with scores
  algorithm VARCHAR(100),
  generated_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  INDEX idx_expires_at (expires_at)
);
```

### User Stats Table
```sql
CREATE TABLE user_stats (
  user_id VARCHAR(255) PRIMARY KEY,
  total_listening_time INT,  -- seconds
  podcasts_completed INT,
  current_streak INT,
  longest_streak INT,
  favorite_categories JSON,
  favorite_channels JSON,
  last_active TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 5. Machine Learning Features

### Feature Engineering
```python
# User features
user_features = {
    'listening_time_total': 18000,
    'completion_rate_avg': 0.78,
    'category_preferences': [0.35, 0.28, 0.15, ...],  # One-hot encoded
    'time_of_day_preference': [0.6, 0.3, 0.1],  # morning, afternoon, evening
    'session_duration_avg': 45,
    'discovery_diversity': 0.65
}

# Podcast features
podcast_features = {
    'category': 'Technology',
    'duration': 2700,  # seconds
    'popularity_score': 0.85,
    'engagement_rate': 0.72,
    'tags': ['AI', 'Future', 'Innovation'],
    'channel_followers': 15000
}
```

### Model Training
```python
# Train recommendation model
from sklearn.ensemble import RandomForestClassifier

# Prepare training data
X_train = prepare_features(user_interactions)
y_train = prepare_labels(user_interactions)  # 1 = liked, 0 = not liked

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predict recommendations
predictions = model.predict_proba(candidate_podcasts)
```

---

## 6. Real-Time Personalization

### Update Recommendations on Interaction
```python
@app.post('/api/personalization/track')
async def track_interaction(event: InteractionEvent):
    # Save interaction
    save_interaction(event)
    
    # Update user profile in real-time
    update_user_profile(event.user_id, event)
    
    # Invalidate recommendation cache
    invalidate_cache(event.user_id)
    
    # Trigger async recommendation refresh
    trigger_recommendation_refresh(event.user_id)
    
    return {"success": True}
```

---

## 7. A/B Testing Framework

### Test Different Algorithms
```python
# Assign users to test groups
test_groups = {
    'control': 0.4,  # Current algorithm
    'variant_a': 0.3,  # New collaborative filtering
    'variant_b': 0.3   # Hybrid approach
}

# Track performance metrics
metrics = {
    'click_through_rate': 0.15,
    'completion_rate': 0.78,
    'engagement_time': 45,
    'user_satisfaction': 4.2
}
```

---

## 8. Implementation Priority

### Phase 1 (MVP)
- [ ] Basic interest-based recommendations
- [ ] Track listening history
- [ ] Simple content-based filtering
- [ ] User stats dashboard

### Phase 2
- [ ] Collaborative filtering
- [ ] Personalized feed
- [ ] Discovery queue
- [ ] Similar podcasts

### Phase 3
- [ ] ML-based recommendations
- [ ] Real-time personalization
- [ ] A/B testing framework
- [ ] Advanced analytics

---

## 9. Performance Optimization

### Caching Strategy
```python
# Cache recommendations for 1 hour
@cache(ttl=3600)
def get_recommendations(user_id):
    return generate_recommendations(user_id)

# Precompute for active users
async def precompute_recommendations():
    active_users = get_active_users(last_7_days=True)
    for user_id in active_users:
        recommendations = generate_recommendations(user_id)
        cache.set(f'recs:{user_id}', recommendations, ttl=3600)
```

### Batch Processing
```python
# Process interactions in batches
@celery.task
def process_interaction_batch(interactions):
    for interaction in interactions:
        update_user_profile(interaction)
        update_podcast_stats(interaction)
    
    # Trigger recommendation refresh for affected users
    affected_users = get_affected_users(interactions)
    for user_id in affected_users:
        refresh_recommendations.delay(user_id)
```

---

## 10. Privacy & Ethics

1. **Data Transparency**: Users can see what data is collected
2. **Opt-Out**: Users can disable personalization
3. **Data Deletion**: Users can request data deletion
4. **Bias Prevention**: Ensure diverse recommendations
5. **Filter Bubble**: Introduce serendipity/exploration
6. **Explainability**: Show why recommendations are made

---

## 11. Testing Checklist

- [ ] Generate recommendations for new user
- [ ] Generate recommendations for active user
- [ ] Track user interaction
- [ ] Update user interests
- [ ] Get user stats
- [ ] Get similar podcasts
- [ ] Get personalized feed
- [ ] Cache invalidation works
- [ ] Real-time updates work
- [ ] Performance under load
