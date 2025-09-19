# SF Airbnb Listings - JavaScript and DOM Self Assessment

A dynamic web application displaying San Francisco Airbnb listings with search and filter functionality. Built with vanilla JavaScript, HTML5, and CSS3.

**Live Demo:** https://ganesh-u.github.io/Airbnb-SF-Listings/

## Assignment Requirements

This self assessment demonstrates:
- AJAX implementation using JavaScript fetch API
- Loading and displaying first 50 listings from JSON data
- Dynamic DOM manipulation without frameworks
- Responsive design with modern CSS

## Features

- **Search & Filter**: Real-time search by name/neighborhood, room type filtering, price sorting
- **Dynamic Content**: All listings generated via JavaScript DOM manipulation
- **Responsive Design**: Mobile-friendly layout using CSS Grid and Flexbox
- **Error Handling**: Graceful fallbacks for missing images and data
- **Modern JavaScript**: Async/await, fetch API, ES6+ features

## Technologies

- HTML5, CSS3, JavaScript (ES6+)
- JSON data source (airbnb_sf_listings_500.json)
- External APIs: Picsum Photos, UI Avatars

## Setup Instructions

1. **Download the project files**

2. **Start a local server** (choose one):
   ```bash
   # Using http-server (recommended)
   npx http-server
   
   # Using reload server
   npx reload
   
   # Using Python
   python -m http.server 8000
   ```

3. **Open browser**: Navigate to the localhost URL shown in terminal

## Project Structure

```
sf-airbnb-listings/
├── index.html
├── css/styles.css
├── js/main.js
├── airbnb_sf_listings_500.json
└── README.md
```

## How It Works

1. **Data Loading**: Fetches JSON file using async/await fetch API
2. **DOM Generation**: Creates listing cards dynamically with JavaScript
3. **User Interaction**: Search and filter functionality with event listeners
4. **Responsive Display**: CSS Grid layout adapts to screen sizes

## Author

Ganesh Umasankar  
Made with ❤️
