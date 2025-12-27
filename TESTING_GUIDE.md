# Recipe App - Testing Guide

## Manual Testing Checklist

### ✅ Backend Tests (Port 5000)

#### 1. MongoDB Connection
- [ ] Backend starts without errors
- [ ] See "Connected to MongoDB" message
- [ ] See "Server running on http://localhost:5000"

#### 2. API Endpoints - Test with Postman or curl

**Test GET all recipes:**
```bash
curl http://localhost:5000/recipes/
```
Expected: Array of recipes (or empty array [])

**Test CREATE recipe:**
```bash
curl -X POST http://localhost:5000/recipes/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Recipe",
    "image": "https://via.placeholder.com/400x300",
    "description": "Test description",
    "ingredients": "Ingredient 1\nIngredient 2",
    "instructions": "Step 1\nStep 2",
    "cookTime": 30,
    "servings": 4,
    "video": ""
  }'
```
Expected: Recipe object with _id

**Test GET single recipe (replace {id} with actual recipe _id):**
```bash
curl http://localhost:5000/recipes/{id}
```
Expected: Single recipe object

**Test UPDATE recipe:**
```bash
curl -X PUT http://localhost:5000/recipes/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Recipe",
    "image": "https://via.placeholder.com/400x300",
    "description": "Updated description",
    "ingredients": "New Ingredient 1",
    "instructions": "New Step 1",
    "cookTime": 45,
    "servings": 6,
    "video": ""
  }'
```
Expected: Updated recipe object

**Test DELETE recipe:**
```bash
curl -X DELETE http://localhost:5000/recipes/{id}
```
Expected: Success message

---

### ✅ Frontend Tests (Port 3000)

#### 1. Page Loading
- [ ] App loads without errors
- [ ] Header displays with logo and navigation
- [ ] Footer displays at bottom
- [ ] Home page shows recipe grid

#### 2. Recipe List Page
- [ ] All recipes display as cards
- [ ] Recipe images load correctly
- [ ] Search bar is functional
  - [ ] Type recipe name and results filter
  - [ ] Clear search shows all recipes again
- [ ] Cards show correct metadata (cooking time, servings)
- [ ] Hover effect shows action buttons (View, Edit, Delete)

#### 3. Add Recipe Page
- [ ] Click "Add Recipe" button navigates to form
- [ ] All form fields render correctly
- [ ] Image preview works when URL is entered
- [ ] Form validation works:
  - [ ] Submit without filling fields shows errors
  - [ ] Errors disappear when fields are filled
  - [ ] Required fields are validated
- [ ] Submit adds recipe to list
- [ ] New recipe appears on home page immediately

#### 4. Recipe Detail Page
- [ ] Click "View Recipe" navigates to detail page
- [ ] Large image displays
- [ ] Cooking time and servings show correctly
- [ ] Description displays
- [ ] Ingredients display as checkboxes
  - [ ] Click checkbox to mark as done
  - [ ] Checkbox styling changes when checked
- [ ] Instructions display with step numbers
- [ ] Video embeds if URL is provided
- [ ] "Back" button works
- [ ] Edit button navigates to edit page
- [ ] Delete button opens confirmation

#### 5. Edit Recipe Page
- [ ] Click "Edit" button navigates to edit form
- [ ] Form fields pre-populate with existing data
- [ ] Image preview shows current image
- [ ] Can modify all fields
- [ ] Submit updates recipe
- [ ] Redirects to detail page after update
- [ ] Changes are reflected on all pages

#### 6. Delete Recipe
- [ ] Delete button shows confirmation dialog
- [ ] Cancel confirmation cancels delete
- [ ] Confirm deletion removes recipe
- [ ] Recipe disappears from list
- [ ] Recipe is no longer accessible

#### 7. Navigation
- [ ] Header logo links to home page
- [ ] "Home" link in header works
- [ ] "Add Recipe" link in header works
- [ ] "Back" buttons work on all pages
- [ ] URLs update correctly

#### 8. Responsive Design
Test on different screen sizes:

**Desktop (1200px+)**
- [ ] Grid shows multiple columns
- [ ] All buttons visible
- [ ] No horizontal scroll

**Tablet (768px - 1199px)**
- [ ] Grid shows 2-3 columns
- [ ] Layout adjusts properly
- [ ] Touch-friendly sizes

**Mobile (< 768px)**
- [ ] Grid shows single column
- [ ] Action buttons stack properly
- [ ] Text readable without zoom
- [ ] All buttons touchable
- [ ] No horizontal scroll

#### 9. Error Handling
- [ ] Display error message if backend is down
- [ ] Retry functionality works
- [ ] Delete confirmation required
- [ ] Form validation prevents invalid submissions

#### 10. Data Persistence
- [ ] Refresh page keeps data
- [ ] Navigate away and back keeps data
- [ ] Recipes persist in MongoDB

---

### 🧪 Sample Test Data

Use this data to test creating recipes:

**Recipe 1: Pancakes**
```
Name: Classic Pancakes
Image: https://images.unsplash.com/photo-1597420679306-c6c72e3c91ff?w=400
Description: Fluffy breakfast pancakes perfect for any morning
Ingredients:
2 cups all-purpose flour
2 tablespoons sugar
2 teaspoons baking powder
1 teaspoon salt
2 cups milk
2 eggs
2 tablespoons melted butter

Instructions:
1. Mix dry ingredients in a large bowl
2. Whisk wet ingredients separately
3. Combine wet and dry ingredients until just blended
4. Heat griddle or skillet over medium-high heat
5. Pour batter onto griddle
6. Cook until bubbles appear on surface
7. Flip and cook until golden
8. Serve hot with toppings

Cook Time: 20
Servings: 4
Video: https://www.youtube.com/embed/VIDEO_ID
```

**Recipe 2: Caesar Salad**
```
Name: Caesar Salad
Image: https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400
Description: Crisp romaine lettuce with homemade caesar dressing
Ingredients:
1 head romaine lettuce
½ cup parmesan cheese
1 cup croutons
4 cloves garlic
3 anchovy fillets
1 egg yolk
2 tablespoons lemon juice
1 teaspoon Dijon mustard
½ cup olive oil

Instructions:
1. Make dressing by blending garlic, anchovies, egg yolk
2. Add lemon juice and mustard
3. Slowly drizzle in olive oil while blending
4. Wash and chop romaine lettuce
5. Toss lettuce with dressing
6. Top with parmesan and croutons
7. Serve immediately

Cook Time: 15
Servings: 2
```

---

### 📊 Test Results Template

```
Backend Status: ✓ Running / ✗ Failed
Frontend Status: ✓ Running / ✗ Failed
Database: ✓ Connected / ✗ Failed

Test Results:
- Page Load: ✓ / ✗
- Add Recipe: ✓ / ✗
- View Recipe: ✓ / ✗
- Edit Recipe: ✓ / ✗
- Delete Recipe: ✓ / ✗
- Search: ✓ / ✗
- Responsive Design: ✓ / ✗
- Validation: ✓ / ✗

Issues Found:
1. ...
2. ...
3. ...
```

---

### 🐛 Debug Tips

1. **Check Backend Logs**
   - Look for MongoDB errors
   - Check for CORS issues
   - Verify port 5000 is available

2. **Check Frontend Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed API calls

3. **Test API Directly**
   - Use Postman or curl to test API
   - Verify data structure matches expectations
   - Check response headers

4. **Browser Testing**
   - Test in multiple browsers
   - Test in incognito mode
   - Clear cache if having issues

---

## Automated Testing (Optional)

For future implementation:
- Jest for unit tests
- React Testing Library for component tests
- Supertest for API tests

See documentation in future updates.
