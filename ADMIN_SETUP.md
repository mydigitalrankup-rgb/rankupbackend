# Admin Panel Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Admin User
```bash
npm run setup-admin
```

This will create an admin user with:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@glinthive.com`

### 3. Start Backend Server
```bash
npm run dev
```

### 4. Access Admin Panel
1. Go to: `http://localhost:5173/admin/login`
2. Login with the credentials above
3. **Important**: Change the password after first login!

## 🔐 Admin Panel Features

### Dashboard
- Total leads overview
- Recent submissions (last 7 days)
- Contact form submissions count
- Advice form submissions count

### Contact Management
- View all contact form submissions
- See full details: name, email, phone, business, services, project details
- Sort by date (newest first)

### Advice Management
- View all free advice submissions
- See details: name, mobile, message
- Sort by date (newest first)

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes
- Token expiration (24 hours)
- Secure admin-only endpoints

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop
- Tablet
- Mobile devices

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/advice` - Submit advice form
- `GET /health` - Health check

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/contacts` - Get all contacts
- `GET /api/admin/advices` - Get all advice submissions

## 🎨 Styling

The admin panel uses:
- Modern dark theme with gold accents
- Glassmorphism effects
- Smooth animations
- Professional UI/UX

## 🔄 Token Management

- Tokens are stored in localStorage
- Automatic token verification on page load
- Automatic logout on token expiration
- Secure token handling

## 📊 Data Structure

### Contact Form Data
```json
{
  "fullName": "string",
  "businessName": "string",
  "email": "string",
  "phone": "string",
  "projectDetails": "string",
  "services": ["array"],
  "createdAt": "date"
}
```

### Advice Form Data
```json
{
  "name": "string",
  "mobile": "string",
  "message": "string",
  "createdAt": "date"
}
```

## 🚨 Important Notes

1. **Change Default Password**: Always change the default admin password after first login
2. **Environment Variables**: Make sure to set up proper environment variables for production
3. **JWT Secret**: Use a strong JWT secret in production
4. **HTTPS**: Use HTTPS in production for security
5. **Database**: Ensure MongoDB is properly secured

## 🆘 Troubleshooting

### Login Issues
- Check if admin user exists: `npm run setup-admin`
- Verify MongoDB connection
- Check server logs for errors

### Token Issues
- Clear localStorage and try logging in again
- Check if JWT_SECRET is set in environment variables
- Verify token expiration

### Data Not Loading
- Check network requests in browser dev tools
- Verify backend server is running
- Check MongoDB connection

## 📞 Support

For any issues or questions, contact the development team.
