# Demo Data - Backup JSON Responses

This directory contains backup JSON responses for demo purposes. Use these when:
- API endpoints are slow or timing out
- AI services (Anthropic) are unavailable
- Network connection is unstable
- Quick demo without waiting for real API calls

## Files

### `listings.json`
Sample response for `/api/listings` endpoint.
- Contains 8 diverse listings across all categories
- Includes realistic prices and descriptions
- Shows variety of items students might sell

**Usage:**
```javascript
// In case /api/listings is slow
const response = await fetch('/demo-data/listings.json')
const data = await response.json()
```

### `ai-description.json`
Sample AI-generated description for a MacBook Pro listing.
- Demonstrates quality of AI output
- Shows student-focused language
- Includes formatting and structure

**Usage:**
```javascript
// Fallback when Anthropic API is slow
const response = await fetch('/demo-data/ai-description.json')
const data = await response.json()
```

### `ai-price.json`
Sample AI price suggestion with reasoning.
- Shows realistic pricing for electronics
- Includes explanation of price rationale

**Usage:**
```javascript
// When AI price suggestion times out
const response = await fetch('/demo-data/ai-price.json')
const data = await response.json()
```

### `listing-detail.json`
Full listing details including seller information.
- Complete listing object with all fields
- Seller profile data included
- Ready to display on detail page

**Usage:**
```javascript
// If /api/listings/[id] is unavailable
const response = await fetch('/demo-data/listing-detail.json')
const data = await response.json()
```

### `conversations.json`
Sample chat conversations for messaging demo.
- 2 sample conversations
- Includes unread counts and timestamps
- Shows different message states

**Usage:**
```javascript
// When chat backend is slow
const response = await fetch('/demo-data/conversations.json')
const data = await response.json()
```

### `messages.json`
Sample messages for a conversation thread.
- 4 messages showing back-and-forth chat
- Includes sender/receiver details
- Shows read/unread states

**Usage:**
```javascript
// Fallback for chat messages
const response = await fetch('/demo-data/messages.json')
const data = await response.json()
```

## Demo Strategy

### Option 1: Manual Fallback
During a demo, if an API call is taking too long:
1. Open DevTools Console
2. Manually fetch backup data
3. Show the expected result

```javascript
// In browser console
fetch('/demo-data/ai-description.json')
  .then(r => r.json())
  .then(console.log)
```

### Option 2: Code Fallback (Advanced)
Add fallback logic to API calls:

```typescript
async function generateDescription(imageData: string) {
  try {
    const response = await fetch('/api/ai/generate-description', {
      method: 'POST',
      body: JSON.stringify({ imageData }),
    })

    // If response is slow (>10s), could add timeout
    return await response.json()
  } catch (error) {
    console.warn('Using fallback data')
    const fallback = await fetch('/demo-data/ai-description.json')
    return await fallback.json()
  }
}
```

### Option 3: Pre-loaded Demo
Before the demo:
1. Seed database with `npm run seed`
2. Pre-generate a few listings with real AI
3. Use those known-good listings during demo
4. Keep backup JSON as last resort

## Best Practices for Demos

1. **Test beforehand**: Run through entire demo flow 30 minutes before
2. **Check API keys**: Ensure all environment variables are set
3. **Network check**: Verify stable internet connection
4. **Browser prep**: Fresh incognito window, clear cache
5. **Backup plan**: Have screenshots if even fallback data fails

## Notes

- All data is **fictional** and for demonstration only
- User IDs (user-123, user-456) are **not real** database IDs
- Images use **Unsplash** URLs (may change over time)
- Prices are **approximate** to real student marketplace

## Updating Demo Data

To update with fresh examples:
1. Create real listings in the app
2. Use browser DevTools Network tab to capture responses
3. Copy JSON response to appropriate file
4. Clean up any sensitive data (real user emails, etc.)

---

**Last Updated**: 2025-10-25
