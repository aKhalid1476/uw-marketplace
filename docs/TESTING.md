# Testing Guide for UW Marketplace

This document provides comprehensive test cases to verify all features work correctly before deployment and during demos.

## 🎯 Testing Objectives

- Verify all core features function correctly
- Ensure error handling works gracefully
- Validate AI integrations perform as expected
- Test authentication and security
- Confirm responsive design and accessibility

---

## 📋 Manual Test Cases

### 1. Email Verification Flow

#### Test Case 1.1: Valid UWaterloo Email Signup
**Steps:**
1. Navigate to `/signup`
2. Enter valid UWaterloo email (e.g., `test@uwaterloo.ca`)
3. Click "Send Verification Code"
4. Check browser console for verification code
5. Enter the 6-digit code
6. Fill in full name and password (min 8 characters)
7. Confirm password
8. Click "Create Account"

**Expected Result:**
- ✅ Success toast: "Verification code sent!"
- ✅ Code appears in browser console (format: `[EMAIL] Verification code: XXXXXX`)
- ✅ Code input field appears
- ✅ After submitting code, password fields appear
- ✅ After creating account, redirected to `/browse`
- ✅ User avatar appears in header with initials

**Pass/Fail:** ___________

---

#### Test Case 1.2: Invalid Email Domain
**Steps:**
1. Navigate to `/signup`
2. Enter non-UWaterloo email (e.g., `test@gmail.com`)
3. Click "Send Verification Code"

**Expected Result:**
- ✅ Error toast: "Please use a valid @uwaterloo.ca email address"
- ✅ No code sent
- ✅ Email input remains editable

**Pass/Fail:** ___________

---

#### Test Case 1.3: Invalid Verification Code
**Steps:**
1. Follow Test Case 1.1 steps 1-4
2. Enter incorrect 6-digit code (e.g., `000000`)
3. Click "Continue"

**Expected Result:**
- ✅ Error toast: "Invalid or expired verification code"
- ✅ Code input remains editable
- ✅ User can try again

**Pass/Fail:** ___________

---

#### Test Case 1.4: Password Validation
**Steps:**
1. Follow Test Case 1.1 steps 1-5
2. Enter password less than 8 characters
3. Enter non-matching confirmation password

**Expected Result:**
- ✅ Error message: "Password must be at least 8 characters"
- ✅ Error message: "Passwords do not match"
- ✅ Submit button disabled or shows error

**Pass/Fail:** ___________

---

### 2. Login Flow

#### Test Case 2.1: Successful Login
**Steps:**
1. Navigate to `/login`
2. Enter registered email
3. Enter correct password
4. Click "Sign In"

**Expected Result:**
- ✅ Success toast: "Welcome back!"
- ✅ Redirected to `/browse`
- ✅ User avatar appears in header
- ✅ Cookie set (check browser DevTools → Application → Cookies → `auth_token`)

**Pass/Fail:** ___________

---

#### Test Case 2.2: Invalid Password
**Steps:**
1. Navigate to `/login`
2. Enter registered email
3. Enter incorrect password
4. Click "Sign In"

**Expected Result:**
- ✅ Error toast: "Invalid email or password"
- ✅ No redirect
- ✅ Password field cleared
- ✅ No cookie set

**Pass/Fail:** ___________

---

#### Test Case 2.3: Persistent Session
**Steps:**
1. Log in successfully (Test Case 2.1)
2. Refresh the page
3. Close browser and reopen
4. Navigate to site

**Expected Result:**
- ✅ User remains logged in after refresh
- ✅ Avatar still visible in header
- ✅ Can access protected routes (`/listings/create`, `/profile`, `/chat`)

**Pass/Fail:** ___________

---

### 3. Create Listing with Image Upload

#### Test Case 3.1: Upload Valid Image
**Steps:**
1. Log in to the app
2. Click "Sell" button in header
3. Click upload area or drag image file
4. Select PNG/JPG/GIF image under 5MB

**Expected Result:**
- ✅ Image preview appears immediately
- ✅ No error messages
- ✅ Image data stored in state (check React DevTools)

**Pass/Fail:** ___________

---

#### Test Case 3.2: Upload Oversized Image
**Steps:**
1. Follow Test Case 3.1 steps 1-2
2. Select image larger than 5MB

**Expected Result:**
- ✅ Error toast: "Image size must be less than 5MB"
- ✅ No preview shown
- ✅ Upload area remains empty

**Pass/Fail:** ___________

---

#### Test Case 3.3: Upload Invalid File Type
**Steps:**
1. Follow Test Case 3.1 steps 1-2
2. Select non-image file (e.g., `.pdf`, `.docx`)

**Expected Result:**
- ✅ Browser file picker filters to images only
- ✅ If bypassed, error message appears
- ✅ No preview shown

**Pass/Fail:** ___________

---

### 4. AI Description Generation

#### Test Case 4.1: Generate Description for Electronics
**Steps:**
1. Upload image of electronic device (laptop, phone, headphones)
2. Click "AI Generate" button next to description field
3. Wait for response (5-10 seconds)

**Expected Result:**
- ✅ Loading toast: "Generating description with AI..."
- ✅ "AI Generate" button shows spinner/disabled state
- ✅ Success toast: "Description generated successfully!"
- ✅ Description field populated with relevant text
- ✅ Description mentions:
  - Item type and brand (if visible)
  - Condition
  - Key features
  - Student-friendly language
  - UWaterloo context

**Pass/Fail:** ___________

**Sample Description Quality Check:**
- Does it accurately describe the item? ___________
- Is it compelling and well-written? ___________
- Does it mention student benefits? ___________

---

#### Test Case 4.2: Generate Description for Furniture
**Steps:**
1. Upload image of furniture (desk, chair, bookshelf)
2. Click "AI Generate"

**Expected Result:**
- ✅ Description mentions furniture type
- ✅ Describes style/color/material
- ✅ Mentions dimensions or size if visible
- ✅ Appeals to student needs (dorm, apartment)

**Pass/Fail:** ___________

---

#### Test Case 4.3: Generate Description for Books
**Steps:**
1. Upload image of textbook or novel
2. Click "AI Generate"

**Expected Result:**
- ✅ Identifies book title if visible
- ✅ Mentions subject/course relevance
- ✅ Notes condition (new, used, highlighted)
- ✅ Student-focused language

**Pass/Fail:** ___________

---

#### Test Case 4.4: AI Error Handling
**Steps:**
1. Temporarily set invalid `ANTHROPIC_API_KEY` in `.env.local`
2. Restart dev server
3. Upload image and click "AI Generate"

**Expected Result:**
- ✅ Error toast: "Failed to generate description"
- ✅ Description field remains editable
- ✅ User can manually type description
- ✅ No app crash

**Pass/Fail:** ___________

---

### 5. AI Price Suggestion

#### Test Case 5.1: Get Price for Electronics
**Steps:**
1. Select category "Electronics"
2. Enter item title (e.g., "iPhone 12")
3. Click "AI Suggest Price" (if implemented)

**Expected Result:**
- ✅ Price suggestion appears (e.g., $450)
- ✅ Price is reasonable for category
- ✅ User can accept or modify price

**Pass/Fail:** ___________

---

#### Test Case 5.2: Get Price for Books
**Steps:**
1. Select category "Books"
2. Enter item title
3. Click "AI Suggest Price"

**Expected Result:**
- ✅ Lower price range suggested ($10-50)
- ✅ Reflects used textbook market
- ✅ Reasonable for student budget

**Pass/Fail:** ___________

---

### 6. Complete Listing Creation

#### Test Case 6.1: Create Full Listing
**Steps:**
1. Upload image
2. Generate AI description (or type manually)
3. Enter title (e.g., "MacBook Pro 2020")
4. Set price ($899)
5. Select category ("Electronics")
6. Click "Create Listing"

**Expected Result:**
- ✅ Success toast: "Listing created successfully!"
- ✅ Redirected to listing detail page (`/listing/[id]`)
- ✅ All details displayed correctly:
  - Title
  - Price ($899.00 format)
  - Description
  - Category badge
  - Image
  - Seller info
  - "Contact Seller" button visible (if not own listing)

**Pass/Fail:** ___________

---

#### Test Case 6.2: Validation Errors
**Steps:**
1. Try to create listing without image
2. Try with empty title
3. Try with negative price
4. Try without category

**Expected Result:**
- ✅ Error messages for each missing field
- ✅ Form submission blocked
- ✅ User guided to fix errors

**Pass/Fail:** ___________

---

### 7. Browse and Filter Listings

#### Test Case 7.1: View All Listings
**Steps:**
1. Navigate to `/browse`
2. Scroll through listings

**Expected Result:**
- ✅ All listings displayed in grid
- ✅ Each card shows:
  - Image
  - Title
  - Price
  - Category badge
- ✅ Grid is responsive (1 col mobile, 2-3 col tablet, 3-4 col desktop)
- ✅ Hover effect on cards

**Pass/Fail:** ___________

---

#### Test Case 7.2: Filter by Category
**Steps:**
1. Navigate to `/browse`
2. Click "Electronics" filter
3. Click "Furniture" filter
4. Click "All Categories"

**Expected Result:**
- ✅ Only Electronics items shown after clicking "Electronics"
- ✅ Only Furniture items shown after clicking "Furniture"
- ✅ All items shown after clicking "All Categories"
- ✅ Filter buttons show active state
- ✅ URL updates with filter (optional)

**Pass/Fail:** ___________

---

#### Test Case 7.3: Search Functionality
**Steps:**
1. Navigate to `/browse`
2. Type "iPhone" in search box
3. Type "desk"
4. Clear search

**Expected Result:**
- ✅ Results filter in real-time as typing
- ✅ Only matching titles/descriptions shown
- ✅ Search is case-insensitive
- ✅ Clear button resets to all listings
- ✅ "No results" message if no matches

**Pass/Fail:** ___________

---

### 8. Chat - Send and Receive Messages

#### Test Case 8.1: Start New Conversation
**Steps:**
1. Log in as User A
2. Navigate to any listing created by User B
3. Click "Contact Seller" button

**Expected Result:**
- ✅ Redirected to `/chat?listing=[id]&user=[seller_id]`
- ✅ Chat interface loads
- ✅ Listing info shown in sidebar (image, title, price)
- ✅ Empty conversation area
- ✅ Message input field ready

**Pass/Fail:** ___________

---

#### Test Case 8.2: Send Message
**Steps:**
1. Follow Test Case 8.1
2. Type message: "Hi! Is this still available?"
3. Press Enter or click Send

**Expected Result:**
- ✅ Message appears immediately in chat
- ✅ Message aligned to right (sender)
- ✅ Timestamp shown
- ✅ Input field clears
- ✅ Message saved to database (check Supabase)

**Pass/Fail:** ___________

---

#### Test Case 8.3: Receive Message (Real-Time)
**Steps:**
1. Open browser window A: User A logged in
2. Open browser window B (incognito): User B logged in
3. In window A: Go to listing by User B, send message
4. In window B: Navigate to `/chat`

**Expected Result:**
- ✅ Window B shows new conversation in sidebar
- ✅ Unread count badge visible
- ✅ Click conversation to open
- ✅ User A's message visible
- ✅ Message aligned to left (receiver)

**Pass/Fail:** ___________

---

#### Test Case 8.4: Real-Time Chat Updates
**Steps:**
1. Both User A and User B in same conversation
2. User A sends message
3. User B sends reply
4. Continue back-and-forth

**Expected Result:**
- ✅ Messages appear in real-time for both users
- ✅ No page refresh needed
- ✅ Conversation scrolls to bottom automatically
- ✅ Timestamps update correctly
- ✅ Messages persist after page refresh

**Pass/Fail:** ___________

---

### 9. Mark Listing as Sold

#### Test Case 9.1: Mark Own Listing as Sold
**Steps:**
1. Navigate to "My Listings" from avatar menu
2. Find active listing
3. Click "Mark as Sold" button (if implemented)

**Expected Result:**
- ✅ Status updates to "Sold"
- ✅ Badge shows "Sold" on listing card
- ✅ Listing remains visible but grayed out
- ✅ "Contact Seller" button disabled

**Pass/Fail:** ___________

---

#### Test Case 9.2: Sold Listings Not Editable
**Steps:**
1. Click on sold listing
2. Attempt to edit details

**Expected Result:**
- ✅ Edit button disabled or hidden
- ✅ Listing shown as read-only
- ✅ Clear indication it's sold

**Pass/Fail:** ___________

---

### 10. Responsive Design on Mobile

#### Test Case 10.1: Mobile Layout (375px width)
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE or set width to 375px
4. Navigate through all pages

**Expected Result:**
- ✅ Header collapses to mobile menu (hamburger icon)
- ✅ Browse page: 1 column grid
- ✅ Listing detail: Full-width layout
- ✅ Chat: Conversation list hides when chat open
- ✅ Forms: Full-width inputs
- ✅ All text readable (no overflow)
- ✅ Buttons large enough to tap (min 44px)

**Pass/Fail:** ___________

---

#### Test Case 10.2: Tablet Layout (768px width)
**Steps:**
1. Set device width to 768px
2. Navigate through pages

**Expected Result:**
- ✅ Browse page: 2-column grid
- ✅ Chat: Side-by-side conversation list and messages
- ✅ Header shows full navigation
- ✅ Forms: Reasonable input widths

**Pass/Fail:** ___________

---

#### Test Case 10.3: Touch Interactions
**Steps:**
1. Use mobile device or touch emulation
2. Test swipe gestures (if any)
3. Test tap targets

**Expected Result:**
- ✅ All buttons easily tappable
- ✅ No accidental clicks
- ✅ Scrolling smooth
- ✅ Modals/dropdowns work with touch

**Pass/Fail:** ___________

---

### 11. Error Handling

#### Test Case 11.1: Network Failure
**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to load browse page
4. Try to create listing

**Expected Result:**
- ✅ Error page or message shown
- ✅ User-friendly error text (not technical jargon)
- ✅ Retry button or instructions
- ✅ No app crash

**Pass/Fail:** ___________

---

#### Test Case 11.2: Invalid API Key (Anthropic)
**Steps:**
1. Set `ANTHROPIC_API_KEY` to invalid value
2. Restart server
3. Upload image and click "AI Generate"

**Expected Result:**
- ✅ Error toast: "Failed to generate description"
- ✅ User can manually type description
- ✅ Rest of form still works
- ✅ Can create listing without AI

**Pass/Fail:** ___________

---

#### Test Case 11.3: Database Connection Error
**Steps:**
1. Set `NEXT_PUBLIC_SUPABASE_URL` to invalid URL
2. Restart server
3. Try to load browse page

**Expected Result:**
- ✅ Error page shown
- ✅ Friendly message
- ✅ No sensitive info leaked (no stack trace visible to user)
- ✅ Console shows detailed error (for debugging)

**Pass/Fail:** ___________

---

#### Test Case 11.4: 404 Not Found
**Steps:**
1. Navigate to `/invalid-page-xyz`
2. Navigate to `/listing/nonexistent-id`

**Expected Result:**
- ✅ Custom 404 page shown
- ✅ Message: "Page not found" or similar
- ✅ Link to go back home
- ✅ Header/footer still visible

**Pass/Fail:** ___________

---

## 🔍 Accessibility Testing

### Test Case A.1: Keyboard Navigation
**Steps:**
1. Use only Tab, Enter, Escape keys
2. Navigate through entire site
3. Create listing using keyboard only

**Expected Result:**
- ✅ All interactive elements focusable
- ✅ Visible focus indicator (outline/ring)
- ✅ Logical tab order
- ✅ Modals closable with Escape
- ✅ Forms submittable with Enter

**Pass/Fail:** ___________

---

### Test Case A.2: Screen Reader Testing
**Steps:**
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate through pages

**Expected Result:**
- ✅ Images have alt text
- ✅ Forms have labels
- ✅ Buttons have descriptive text
- ✅ Headings in logical hierarchy

**Pass/Fail:** ___________

---

## 🎯 Performance Testing

### Test Case P.1: Page Load Speed
**Steps:**
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check load time

**Expected Result:**
- ✅ Browse page loads in < 3 seconds
- ✅ Listing detail loads in < 2 seconds
- ✅ No unnecessary requests
- ✅ Images lazy-loaded

**Pass/Fail:** ___________

---

### Test Case P.2: AI Generation Speed
**Steps:**
1. Upload image
2. Click "AI Generate"
3. Time the response

**Expected Result:**
- ✅ Response in 3-10 seconds
- ✅ Loading indicator shown
- ✅ User can cancel or navigate away

**Pass/Fail:** ___________

---

## 📊 Testing Summary

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Authentication | 7 | ___ | ___ | ___% |
| Listing Creation | 6 | ___ | ___ | ___% |
| AI Features | 6 | ___ | ___ | ___% |
| Browse & Search | 3 | ___ | ___ | ___% |
| Chat System | 4 | ___ | ___ | ___% |
| Responsive Design | 3 | ___ | ___ | ___% |
| Error Handling | 4 | ___ | ___ | ___% |
| Accessibility | 2 | ___ | ___ | ___% |
| Performance | 2 | ___ | ___ | ___% |
| **TOTAL** | **37** | ___ | ___ | ___% |

---

## 🚨 Critical Path Tests (Demo Minimum)

These tests MUST pass before any demo:

1. ✅ User can sign up and log in
2. ✅ User can create listing with image upload
3. ✅ AI description generation works
4. ✅ Listings appear on browse page
5. ✅ User can view listing details
6. ✅ Chat system sends and receives messages
7. ✅ No console errors on any page

---

## 🐛 Bug Report Template

If a test fails, document it here:

**Test Case:** [e.g., Test Case 4.1]
**Date:** [YYYY-MM-DD]
**Tester:** [Your Name]
**Browser:** [Chrome 120, Safari 17, etc.]
**Device:** [Desktop, iPhone 12, etc.]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**

**Actual Result:**

**Screenshots/Logs:**

**Severity:** Critical / High / Medium / Low

---

## ✅ Pre-Demo Checklist

**30 Minutes Before Demo:**
- [ ] Run all Critical Path Tests
- [ ] Clear browser cache and cookies
- [ ] Restart dev server
- [ ] Check all environment variables are set
- [ ] Test internet connection speed
- [ ] Have backup screenshots ready

**5 Minutes Before Demo:**
- [ ] Open app in fresh incognito window
- [ ] Log in with demo account
- [ ] Verify AI features work (test one description generation)
- [ ] Check chat system loads
- [ ] Close all unnecessary tabs
- [ ] Silence phone notifications

---

**Happy Testing! 🚀**
