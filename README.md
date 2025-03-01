# JobNest

JobNest is a specialized backend platform designed to help users find job opportunities relevant to their skills and interests. Built using **Node.js, Express, and GraphQL**, the system provides a **scalable, modular, and secure** API for job seekers, recruiters, and company administrators.

## Features 🚀
- **Job Management**: HR and company owners can add, update, and delete job postings.
- **User Authentication**: Secure login & registration with JWT authentication.
- **GraphQL API**: Retrieve all users and companies in a single request.
- **Job Search & Filtering**: Search jobs using keywords, location, seniority level, and technical skills.
- **Application Tracking**: View applications for specific jobs and accept/reject candidates.
- **Admin Controls**: Approve, ban/unban users and companies.
- **Rate Limiting**: Protects the API from excessive requests.
- **Export Applications**: Generate an Excel sheet for job applications on a specific date.

## Tech Stack 🛠
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **API**: RESTful + GraphQL
- **Security**: Rate Limiting, Data Encryption
- **File Handling**: Multer, ExcelJS

## Installation 🛠

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/your-username/jobnest-backend.git
   cd jobnest-backend
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Server**:
   ```sh
   npm start
   ```

## API Endpoints 📌
### **Authentication**
- `POST /auth/register` → Register a new user
- `POST /auth/login` → Login and receive a JWT token

### **Jobs Management**
- `POST /jobs` → Create a new job (HR/Owner only)
- `PUT /jobs/:id` → Update a job (Owner only)
- `DELETE /jobs/:id` → Delete a job (HR only)
- `GET /jobs` → Get all jobs (with pagination & filtering)
- `GET /jobs/:id` → Get job details

### **Applications**
- `POST /jobs/:id/apply` → Apply for a job
- `GET /jobs/:id/applications` → Get job applications (HR/Admin only)
- `PATCH /applications/:id/status` → Accept/Reject an applicant

### **Admin Controls**
- `PATCH /admin/users/:id/ban` → Ban/unban a user
- `PATCH /admin/companies/:id/ban` → Ban/unban a company
- `PATCH /admin/companies/:id/approve` → Approve a company

### **GraphQL API**
- `POST /graphql` → Query users and companies in one request
  ```graphql
  query {
    getAllData {
      users { firstName, lastName, email }
      companies { companyName, industry }
    }
  }
  ```

### **Rate Limiting**
To prevent API abuse, rate limiting is applied using `express-rate-limit`.

## License 📜
This project is licensed under the **MIT License**.

---
🚀 **Happy Coding!**
