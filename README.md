## Student
- Gurneet Kaur

## Phase 4 Implementation Tasks

### 1. Develop UI for Features
- Created **forms/UI for CRUD operations**:
  - **Book Appointment** – create new appointments with ID, patient name, doctor, date, time, and status.
  - **Edit Appointment** – update existing appointment with pre-filled form.
  - **View Appointment** – fetch and display appointment details by ID.
- **React Router** used for navigation between pages (e.g., `/`, `/edit/:id`, `/book`, `/view/:id`).
- **Client-side validation** included:
  - Required fields (ID, patient name, doctor, date, time)
  - Status selection
- **User-friendly feedback**:*
  - Error messages displayed for invalid inputs
  - Success messages displayed after create/update
- Implemented frontend **Searching, sorting, filtering and pagination** for the appointments list.

### 2. API Integration
- Used fetch hook** to interact with backend.
- All **CRUD operations performed through API calls** (no hard-coded data):
  - Create appointment (`POST /api/appointments`)
  - Edit appointment (`PUT /api/appointments/:id`)
  - View appointment (`GET /api/appointments/:id`)
- Backend validation ensures correct data is stored in MongoDB.

### 3. Testing
- Frontend tested by performing all CRUD operations:
  - Verified **data updates correctly** in MongoDB Atlas.
  - Verified **form validations, error messages, and success feedback** display correctly.
  - Verified **View Appointment** correctly fetches and displays data.

---