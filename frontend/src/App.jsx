import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppointmentsList from "./components/AppointmentList";
import BookAppointment from "./components/BookAppointment";
import EditAppointment from "./components/EditAppointment";
import ViewAppointment from "./components/ViewAppointment";
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Appointments</Link> | <Link to="/book">Book Appointment</Link> 

      </nav>
      <Routes>
        <Route path="/" element={<AppointmentsList />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/edit/:id" element={<EditAppointment />} /> 
        <Route path="/appointment/:id" element={<ViewAppointment />} />

      </Routes>
    </Router>
  );
}

export default App;
