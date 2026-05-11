Tech Stack
Frontend
React 18
TypeScript
Vite
React Router
React Hook Form + Zod
Tailwind CSS
React Hot Toast
Backend
ASP.NET Core 8 Web API
Entity Framework Core
SQLite
FluentValidation
Swagger / OpenAPI
Testing
Vitest + React Testing Library
xUnit + FluentAssertions
Frontend
User list page
Add user form
Client-side validation
Loading and error states
Toast notifications
Responsive UI
Backend
Full CRUD API
SQLite database
Request validation
Swagger documentation
Proper HTTP status codes
Bonus
Docker support
Unit tests
JWT authentication setup (optional)
###################
Project Structure
user-directory/
├── backend/
│   ├── UserDirectory.Api/
│   └── UserDirectory.Tests/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── test/
│
├── docker-compose.yml
└── README.md


################################
Frontend:

http://localhost:5173

Swagger:

https://localhost:53151/swagger


############################
API Endpoints
Method	Endpoint
GET	/api/users
GET	/api/users/{id}
POST	/api/users
PUT	/api/users/{id}
DELETE	/api/users/{id}
Validation Rules
Field	Rules
Name	Required, 2–100 chars
Age	0–120
City	Required
State	Required
Pincode	4–10 chars
Design Notes
React Hook Form + Zod used for simple and fast form validation
FluentValidation used for backend validation
SQLite chosen for lightweight local setup
EnsureCreated() used to simplify setup for the coding task

###########################
AI Disclosure

AI tools were used to assist with:

Project scaffolding
Boilerplate generation
Validation setup
Unit tests
README drafting
#########################
