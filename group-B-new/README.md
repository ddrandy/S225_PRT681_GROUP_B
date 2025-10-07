cd "\group B new"
$env:ASPNETCORE_ENVIRONMENT="Development"
$env:ASPNETCORE_URLS="http://localhost:5000"
.\start-backend.bat

http://localhost:5000/swagger

cd "\group B new"
.\start-frontend.bat
http://localhost:3000`

# NT Local Event Finder

A web-based platform designed to help people in the Northern Territory discover, share, and manage local events.

## Features

### For Users
- **Browse Events**: Search and filter events by date, location, and category
- **Event Details**: View comprehensive event information with location maps
- **Favorites**: Save events for quick access
- **User Registration**: Create accounts with the first user becoming admin
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### For Administrators
- **Event Management**: Approve, edit, or delete events
- **User Management**: View and manage user accounts
- **Admin Dashboard**: Comprehensive control panel

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: C# .NET 9.0 Web API
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with NT-inspired color theme

## Color Theme

The application uses colors inspired by the Northern Territory environment:
- **Desert Red**: #C1440E
- **Ocean Blue**: #007B9E
- **Forest Green**: #2C6E49
- **Sand Beige**: #EAD2AC

## Project Structure

```
NT Event Finder/
├── Backend/                 # .NET Web API
│   ├── Controllers/         # API Controllers
│   ├── Models/             # Data Models
│   ├── Data/               # Database Context
│   ├── DTOs/               # Data Transfer Objects
│   ├── Services/           # Business Logic
│   └── Program.cs          # Application Entry Point
├── Frontend/               # Web Frontend
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript Files
│   ├── index.html          # Homepage
│   ├── browse.html         # Browse Events
│   ├── event-detail.html   # Event Details
│   ├── submit.html         # Submit Event
│   ├── favorites.html      # User Favorites
│   ├── dashboard.html      # User/Admin Dashboard
│   ├── login.html          # Login Page
│   ├── register.html       # Registration Page
│   └── about.html          # About Page
└── assets/                 # Image Assets
```

## Setup Instructions

### Prerequisites
- .NET 9.0 SDK
- A modern web browser
- Code editor (Visual Studio, VS Code, etc.)

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Run the backend API:
   ```bash
   dotnet run
   ```

   The API will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory
2. Open `index.html` in a web browser or use a local web server:
   
   **Option 1: Using Live Server (VS Code Extension)**
   - Install Live Server extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

   **Option 2: Using Python HTTP Server**
   ```bash
   cd Frontend
   python -m http.server 3000
   ```
   Then open `http://localhost:3000`

   **Option 3: Using Node.js HTTP Server**
   ```bash
   cd Frontend
   npx http-server -p 3000
   ```

### Database

The SQLite database (`nteventfinder.db`) will be automatically created when you first run the backend API.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/{id}` - Get specific event
- `POST /api/events` - Create new event (requires auth)
- `PUT /api/events/{id}` - Update event (requires auth)
- `DELETE /api/events/{id}` - Delete event (requires auth)
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events

### Favorites
- `GET /api/favorites` - Get user's favorites (requires auth)
- `POST /api/favorites/{eventId}` - Add to favorites (requires auth)
- `DELETE /api/favorites/{eventId}` - Remove from favorites (requires auth)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get specific user
- `GET /api/users/profile` - Get current user profile (requires auth)
- `DELETE /api/users/{id}` - Delete user (admin only)

## Default Admin Account

The first user to register will automatically become an administrator with full privileges to:
- Approve/reject submitted events
- Manage all events
- View and manage user accounts
- Access the admin dashboard

## Usage Guide

### For Regular Users

1. **Registration**: Create an account on the registration page
2. **Browse Events**: Use the browse page to find events with filters
3. **View Details**: Click on any event to see full details
4. **Save Favorites**: Click the favorite button to save events
5. **Submit Events**: Use the submit page to share your events
6. **Dashboard**: View your submitted events and favorites

### For Administrators

1. **Admin Dashboard**: Access additional admin controls
2. **Approve Events**: Review and approve user-submitted events
3. **Manage Users**: View and manage user accounts
4. **Event Management**: Edit or delete any events

## Development Notes

### Configuration
- JWT settings can be modified in `appsettings.json`
- API base URL is configured in `Frontend/js/config.js`
- CORS is configured to allow frontend origins

### Security Features
- Password hashing using BCrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention through Entity Framework

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Hamburger menu for mobile navigation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is added to CORS policy in `Program.cs`
2. **Database Issues**: Delete `nteventfinder.db` to reset the database
3. **Port Conflicts**: Change ports in configuration if needed
4. **Image Loading**: Ensure image paths are correct relative to the frontend

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Future Enhancements

- Email notifications for event updates
- Event ticketing and payment integration
- Calendar view for events
- Push notifications
- Social media integration
- Event categories expansion
- Advanced search functionality
- Event reviews and ratings

## License

This project is developed for educational purposes as part of the CDU Semester 4 Group B project.

## Contributors

- Group B Members
- CDU Semester 4, 2025

## Support

For support or questions, please contact the development team or refer to the project documentation.
