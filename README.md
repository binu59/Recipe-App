# Recipe App - Full Stack Application

A modern, responsive recipe management application built with React and Node.js/Express, featuring complete CRUD operations for managing recipes.

## Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, and Delete recipes
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✅ **Modern UI** - Beautiful gradient design with smooth animations
- ✅ **Search Functionality** - Filter recipes by name
- ✅ **Image Preview** - Upload and display recipe images
- ✅ **Ingredient Checklist** - Interactive ingredient checking
- ✅ **Step-by-Step Instructions** - Clear numbered steps
- ✅ **Video Integration** - Embed YouTube videos with recipes
- ✅ **Recipe Details** - Cooking time, servings, and comprehensive information

## Tech Stack

### Frontend
- React 19
- React Router v7 (for navigation)
- Lucide React (for icons)
- CSS3 (with responsive design)

### Backend
- Node.js with Express
- MongoDB (Atlas)
- CORS middleware

## Project Structure

```
RecipeApp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── RecipeList/
│   │   │   ├── RecipeDetail/
│   │   │   ├── AddRecipe/
│   │   │   └── EditRecipe/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── backend/
    ├── Model/
    │   └── RecipeModel.js
    ├── Controller/
    │   └── RecipeController.js
    ├── Routes/
    │   └── RecipeRoute.js
    ├── server.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update MongoDB Connection (if needed):**
   - Edit `server.js` and update the MongoDB connection string

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:5000/recipes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all recipes |
| GET | `/:id` | Get recipe by ID |
| POST | `/` | Create new recipe |
| PUT | `/:id` | Update recipe |
| DELETE | `/:id` | Delete recipe |

### Request/Response Format

**Create/Update Recipe (POST/PUT):**
```json
{
  "name": "Pasta Carbonara",
  "image": "https://example.com/image.jpg",
  "description": "Classic Italian pasta dish",
  "ingredients": "400g spaghetti\n200g bacon\n4 eggs\n100g cheese",
  "instructions": "1. Cook pasta\n2. Fry bacon\n3. Mix ingredients\n4. Combine and serve",
  "cookTime": 30,
  "servings": 4,
  "video": "https://www.youtube.com/embed/VIDEO_ID"
}
```

## Features Overview

### Recipe List Page
- View all recipes in a responsive grid layout
- Search recipes by name
- Quick action buttons (View, Edit, Delete)
- Recipe metadata display (cooking time, servings)

### Add Recipe Page
- Comprehensive form with validation
- Image URL preview
- Multi-line text areas for ingredients and instructions
- Cooking time and servings inputs
- Optional video URL field

### Recipe Detail Page
- Full recipe display with large image
- Interactive ingredient checklist
- Step-by-step numbered instructions
- Video player integration
- Edit and Delete buttons
- Navigation back to list

### Edit Recipe Page
- Pre-populated form with existing recipe data
- Same validation as Add Recipe
- Image preview
- Easy recipe modification

## Responsive Design Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 768px - 1199px
- **Mobile:** Below 768px

All components are fully responsive and adapt to different screen sizes.

## Color Scheme

- **Primary:** #667eea (Purple)
- **Secondary:** #764ba2 (Dark Purple)
- **Accent:** #ff6b6b (Red)
- **Background:** #f5f6fa (Light Gray)
- **Text:** #2c3e50 (Dark Blue)

## Available Scripts

### Frontend
```bash
npm start       # Start development server
npm build       # Build for production
npm test        # Run tests
```

### Backend
```bash
npm start       # Start server
npm run dev     # Start with nodemon (if installed)
```

## Key Components

### Header Component
- Sticky navigation bar
- Logo and app title
- Navigation links
- Add Recipe button

### Footer Component
- Company information
- Quick links
- Copyright information

### RecipeList Component
- Fetches and displays all recipes
- Search functionality
- Delete with confirmation
- Hover effects with action buttons

### RecipeDetail Component
- Single recipe display
- Interactive ingredients
- Video embedding
- Edit/Delete options

### AddRecipe & EditRecipe Components
- Form validation
- Error handling
- Image preview
- Loading states

## Error Handling

- Form validation with user-friendly error messages
- Network error handling with user feedback
- Loading states for async operations
- Confirmation dialogs for destructive actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication
- Recipe ratings and reviews
- Meal planning features
- Shopping list generation
- Recipe categories/filters
- Difficulty levels
- Calorie information
- Save favorite recipes

## Troubleshooting

### Backend not connecting to MongoDB
- Verify MongoDB Atlas connection string
- Check internet connection for database access
- Ensure IP whitelist includes your machine

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in frontend/src/services/api.js

### Port already in use
- Change port in server.js for backend
- Use different port: `npm start -- --port 3001` for frontend

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
