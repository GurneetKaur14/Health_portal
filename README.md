# Health Portal Project

## Phase 5: Authentication & Authorization

**Objective:**  
Secure the project with JWT-based authentication, email-based OTP verification, and role-based access control (RBAC).  

---

### 1. User Roles
The system supports the following roles:  
- **Admin** – Full access to all routes and user management.  
- **Doctor** – Can view and manage their own appointments.  
- **Patient** – Can book and view their own appointments.  

---

### 2. Authentication Flow
1. **Login (Step 1)**  
   - Users provide **email** and **password**.  
   - Backend validates credentials and generates a **6-digit OTP**.  
   - OTP is sent to the user’s email and stored temporarily in the backend.  

2. **OTP Verification (Step 2)**  
   - Users enter the OTP on the verification page.  
   - Backend validates OTP and generates a **JWT access token**.  
   - The JWT includes the user’s `_id` and `role`.  

3. **Token Storage**  
   - Token and user details are stored in **localStorage**.  
   - Token is attached to all protected API requests.  

4. **Logout**  
   - Clears token and user information from localStorage.  
   - Redirects user to the login page.  

---

### 3. Protected Routes & Role-Based Access Control (RBAC)
- **Admin-only routes:**  
   Manage users (create, update, delete)  

- **Doctor routes:**  
   View and manage their own appointments  
   Update appointment status  

- **Patient routes:**  
   Book new appointments  
   View own appointments  

**Middleware:**  
- `authorize(allowedRoles)` checks JWT validity and user role.  
- Unauthorized access returns **401** (no token / expired) or **403** (role mismatch).  

---

### 4. Frontend Implementation
- **Login page** (`Login.jsx`) – Handles email/password input and sends OTP request.  
- **OTP verification page** (`VerifyOtp.jsx`) – Validates OTP and retrieves JWT token.  
- **ProtectedRoute component** – Ensures users without a valid token are redirected to `/login`.  
- **Role-based UI** –  
  - Doctor sees only their appointments with status update buttons.  
  - Patient sees only their appointments and can book new ones.  

---

### 5. Backend Implementation
- **Routes**:  
  - Public: `/register`, `/login`, `/verify-login`  
  - Protected: `/appointments`, `/users/me`, `/appointments/:id`  
  - Role-restricted: `/users` (admin), `/appointments/:id/status` (doctor/admin)  

- **OTP Storage:** Stored temporarily in MongoDB (`otpModel`) and deleted after verification.  
- **JWT:** Signed with secret key, includes `_id` and `role`.  
- **Password Security:** Hashed with **bcrypt**.  

---

### 6. Testing Scenarios
- Login with **valid** and **invalid credentials**.  
- OTP flow **success** and **failure**.  
- Accessing **protected routes** without a token → redirected to `/login`.  
- Accessing **restricted routes** with wrong role → 403 error.  
- Accessing routes after token **expires** → 401 error.  
- Frontend **hides UI elements** based on user role.  

---

### 7. Notes
- OTP expires after 5 minutes.  
- JWT is required for all protected requests.  
- Role-based access ensures users can only view/modify what they are permitted.  

---

