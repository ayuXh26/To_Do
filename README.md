📝 Full-Stack To-Do App

A robust task management application featuring secure user authentication and persistent database storage.

🚀 Features

User Authentication: Secure Signup and Login using bcrypt for password hashing and JWT for session management.

Session Security: Uses HTTP-Only Cookies to store authentication tokens, preventing client-side script access.

Private Task Lists: Users can only view, edit, and delete their own tasks (Backend validation via req.userId).

REST API: Clean API endpoints for creating (POST /create-task), retrieving (GET /task), and managing tasks.
Data Validation: Backend validation prevents empty tasks or duplicate user emails.

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB, Mongoose ODM

Authentication: JSON Web Tokens (JWT), Bcrypt, Cookie-Parser

Frontend: HTML5, CSS3, Vanilla JavaScript (Fetch API)

💡 Key Learnings

Middleware Logic: Learned how to write custom middleware (userAuth) to intercept requests and inject user data (req.userId) into routes.

Debugging: Gained experience debugging complex issues like CORS policies, Middleware ordering in Express, and MongoDB Indexing conflicts (e.g., handling unique constraints).

State Management: Managed frontend state updates after asynchronous API calls to ensure the UI stays in sync with the database.
