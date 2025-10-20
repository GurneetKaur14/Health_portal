# Student: 
Gurneet Kaur
# GitHub Repository Link:
https://github.com/GurneetKaur14/Health_portal.git

# Healthcare Tracker and Appointment portal
This full stack project is a healthcare tracker and appointment portal for tracking health records and appointments.

# Key Features:
•	Authentication & Authorisation: The system will validate the user information before they are allowed to log in. Patients can only view their own data, while Doctors can see all the appointments and assigned patients.

•	Health Tracking: To manage (create, update, delete, view) and set and monitor health goals, CRUD operations will be performed. Filtering data by date and paginating large datasets (e.g., daily logs over months/years)

•	Appointment Manager: It will allow patients to browse doctors based on specialization, availability and location. Doctors can view the appointments requested and have the authority to confirm or reject an appointment. Pagination on a large appointment list.

•	Records and History: Doctors can add prescriptions, diagnoses or leave any required comments. Patients can view their medical history.

•	Progress Dashboard: Graphs and charts for steps, calories, and heart rate trends. 

# Implemented modular architecture
- Each module have its own folders:
- Models: Handle CRUD operations and read/write to JSON files.
- Routes: Independent Express Router for each module.
- Middlewares: Input validation using `express-validator`.

---

# ## API Endpoints (Examples)

### Users
- `GET /api/users` → Get all users
- `GET /api/users/:id` → Get a single user
- `POST /api/users` → Add new user (with validation)
- `PUT /api/users/:id` → Update user (with validation)
- `DELETE /api/users/:id` → Delete user

### Appointments
- `GET /api/appointments` → Get all appointments
- `GET /api/appointments/:id` → Get single appointment
- `POST /api/appointments` → Create new appointment (validate patient, doctor, date)
- `PUT /api/appointments/:id` → Update appointment
- `DELETE /api/appointments/:id` → Delete appointment

*(Similar endpoints implemented for HealthRecords, HealthMetrics, and HealthTracker)*

---

## Validation
- Email must be valid (`example@domain.com`)
- Role must be `patient` or `doctor`
- Required fields cannot be empty
- IDs are numeric and validated before CRUD operations

---

## HTTP Responses
- 200 OK → Successful GET, PUT, DELETE
- 201 Created → Successful POST
- 400 Bad Request → Validation errors
- 404 Not Found → Resource not found
- 500 Internal Server Error → Server errors

---

## Testing
- All endpoints tested in **Postman**.
- CRUD operations verified for each module.
- Validation errors and 404 handling confirmed.

---

## Contribution
- Gurneet Kaur: Implemented modular architecture, CRUD logic, validation, and all five modules.

---

## Notes
- JSON files act as the data source for all modules.
- Server runs on port **3000** by default (`node server.js`).