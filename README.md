**📝 Full-Stack To-Do App**

A robust task management application featuring secure user authentication, private data handling, and a modern, responsive user interface. This project demonstrates a complete implementation of a RESTful API with persistent MongoDB storage and secure session management.

**🚀 Features**

User Authentication: Secure Signup and Login workflows utilizing bcrypt for password hashing and JSON Web Tokens (JWT) for session management.

Session Security: Authentication tokens are stored in HTTP-Only Cookies, providing a defense against client-side script access.

Private Task Lists: Multi-tenant architecture ensuring users can only view, create, edit, and delete their own tasks via backend validation.

Password Recovery: Integrated "Forgot Password" functionality that generates secure reset tokens and sends recovery links via SendGrid.

RESTful API: Clean API endpoints for task and user management.

Data Integrity: Strict backend validation using validator and custom regex to ensure data quality.

Responsive Design: A dark-themed UI built with modern CSS animations and Bootstrap icons, optimized for both desktop and mobile devices.

**🛠️ Tech Stack**

**Backend**

•  Runtime: Node.js

•  Framework: Express.js

•  Database: MongoDB with Mongoose ODM

•  Authentication: JWT, Bcrypt, and Cookie-Parser

•  Email Service: SendGrid (@sendgrid/mail)

**Frontend**

•  Structure: HTML5

•  Styling: CSS3 with Custom Animations

•  Interactivity: Vanilla JavaScript (Fetch API)

**💡 Key Learnings & Problem Solving**

**•  CORS Configuration Across Environments**

Faced persistent “Blocked by CORS” errors when integrating the deployed frontend with the backend on Render. Resolved this by implementing a dynamic origin validation strategy using a whitelist of allowed URLs, separating development and production environments cleanly, and avoiding misconfigured comma-separated environment variables.

**•  Environment Variable Management in Production**

Encountered runtime failures due to mismatches between local .env files and Render’s production environment variables. Learned the importance of explicitly defining and validating environment variables (JWT secrets, frontend URLs, API keys) in the hosting platform and verifying their presence during debugging.

**•  Secure Password Reset Architecture**

↠  Designed and implemented a secure password reset flow using:

↠  Cryptographically secure tokens (crypto.randomBytes)

↠  Token expiration timestamps (1-hour validity)

↠  Token invalidation after use

↠  Non-enumerative responses (avoiding account existence disclosure)

↠  SendGrid integration for delivery

**•  JWT-Based Authentication with HTTP-Only Cookies**

Implemented session management using JWT stored in HTTP-only cookies to mitigate XSS risks. Built a custom userAuth middleware to validate tokens and attach authenticated user data to requests before protected route execution.

**•  Middleware Execution Flow Debugging**

Resolved issues where protected routes executed without proper authentication context by ensuring JWT verification occurs before route handlers and by explicitly attaching userId to the request object.

**•  Frontend–Backend State Synchronization**

Addressed inconsistencies between UI state and database state after async operations. Implemented a refreshTask() mechanism to fetch updated task data from the backend after Create/Delete operations to maintain UI consistency.

**•  Two-Layer Data Validation Strategy**

Prevented malformed input and server crashes by implementing:

↠  Frontend validation for immediate user feedback

↠  Backend validation utilities for enforcing strong password policies and valid email formats

**•  MongoDB Uniqueness & Data Integrity**

Encountered duplicate email registration conflicts and resolved them by checking for existing users before insertion and returning meaningful, user-friendly errors instead of relying solely on database exceptions.

**•  Deployment & Debugging Discipline**

Learned to systematically diagnose production errors by interpreting error codes (ENETUNREACH, Unauthorized, 500), isolating layers (network vs application vs configuration), and avoiding guesswork in favor of structured debugging.
