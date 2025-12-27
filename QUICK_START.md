# Recipe App - Quick Start Guide

## 🚀 Getting Started

### Step 1: Start the Backend

```bash
cd backend
npm install  # if not already done
npm start
```

You should see: `Connected to MongoDB` and `Server running on http://localhost:5000`

### Step 2: Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install  # if not already done
npm start
```

The React app will automatically open at `http://localhost:3000`

## ✨ Features & Usage

### 1. **View Recipes** (Home Page)
- See all recipes in a beautiful grid layout
- Search recipes by name
- View recipe metadata (cooking time, servings)

### 2. **Add New Recipe**
- Click "Add Recipe" button in header
- Fill in recipe details:
  - Recipe name
  - Image URL
  - Description
  - Ingredients (one per line)
  - Instructions (one step per line)
  - Cooking time and servings
  - Optional: YouTube video URL
- Submit and recipe appears in the list

### 3. **View Recipe Details**
- Click "View Recipe" or "View" button on any recipe card
- See full recipe with:
  - Large image
  - Cooking time and servings stats
  - Interactive ingredient checklist (click to mark as done)
  - Step-by-step instructions
  - Embedded video (if available)

### 4. **Edit Recipe**
- Click "Edit" button on recipe card or recipe detail page
- Modify any recipe details
- Save changes

### 5. **Delete Recipe**
- Click "Delete" button on recipe card or recipe detail page
- Confirm deletion

## 📱 Responsive Design

The app is fully responsive on:
- **Desktop** - Full-featured layout with cards
- **Tablet** - Adjusted grid and spacing
- **Mobile** - Single column layout with touch-friendly buttons

## 🎨 Design Features

- **Modern Gradient Header** - Purple gradient with sticky navigation
- **Card-based Layout** - Clean, organized recipe cards
- **Hover Effects** - Interactive buttons with smooth transitions
- **Form Validation** - Real-time error messages
- **Image Previews** - See images as you add them
- **Interactive Checklists** - Check off ingredients as you cook

## 🔧 Configuration

### Change Backend Port
Edit `backend/.env`:
```
PORT=8000  # Change from 5000 to 8000
```

### Change API URL
Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000/recipes
```

## ⚠️ Troubleshooting

### "Cannot connect to backend"
1. Ensure backend is running on port 5000
2. Check MONGODB_URI is correct in backend/.env
3. Verify both backend and frontend are using correct URLs

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
npx kill-port 3000
npm start
```

### "MongoDB connection failed"
- Check internet connection
- Verify MongoDB Atlas credentials
- Ensure IP is whitelisted in MongoDB Atlas

## 📦 Recipe Data Structure

```javascript
{
  _id: "MongoDB ID",
  name: "Pasta Carbonara",
  image: "https://example.com/image.jpg",
  description: "Classic Italian dish...",
  ingredients: "400g pasta\n200g bacon\n...",
  instructions: "1. Boil pasta\n2. Fry bacon\n...",
  cookTime: 30,
  servings: 4,
  video: "https://youtube.com/embed/..."
}
```

## 🎯 Key Keyboard Shortcuts

- **Search**: Type in search bar to filter recipes
- **Enter**: Submit forms
- **Escape**: Close modals/navigate back

## 💡 Tips

1. **Use quality image URLs** - Recipes look better with good images
2. **Clear instructions** - Number your steps for clarity
3. **Ingredient format** - One ingredient per line works best
4. **YouTube videos** - Use the embed URL from YouTube

## 📚 API Documentation

See [README.md](./README.md) for complete API documentation.

## 🤝 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify backend is running
3. Check network tab in browser DevTools
4. Review the main README.md

---

**Happy Cooking!** 🍳
