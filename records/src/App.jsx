import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin/AdminPanel";
//import StudentPanel from "./pages/Student/StudentPanel";
import AddUser from "./pages/admin/AddUser";
import StaffList from "./pages/admin/StaffList";
import StudentList from "./pages/admin/StudentList";
import StudentBackground from "./pages/Student/StudentBackground";
import StudentPersonalDetails from "./pages/Student/StudentPersonalDetails";
import StudentCourses from "./pages/Student/StudentCourses";
import StudentEventAttended from "./pages/Student/StudentEventAttended";
import StudentEventOrganized from "./pages/Student/StudentEventOrganized";
import StudentCertificate from "./pages/Student/StudentCertificate";
import StudentOnlineCourses from "./pages/Student/StudentOnlineCourses";
import StudentAchievements from "./pages/Student/StudentAchievements";
import StudentInternship from "./pages/Student/StudentInternship";
import StudentScholarship from "./pages/Student/StudentScholarship";
import StudentLeave from "./pages/Student/StudentLeave";
import Dashboard from "./pages/StaffPage/Dashboard";
//import StaffPanel from "./pages/StaffPage/StaffPanel";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import MyProfile from "./pages/MyProfile";
import Sheet from "./pages/Sheet";
import Bulk from "./pages/admin/Bulk";
import MyWard from "./pages/StaffPage/MyWard";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentBioData from "./pages/Student/StudentBioData";

// New Staff Pages
import DashboardPage from './pages/StaffPage/DashboardPage';
import ProposalsPage from './pages/StaffPage/ProposalsPage';
import EventsPage from './pages/StaffPage/EventsPage';
import IndustryPage from './pages/StaffPage/IndustryPage';
import CertificationsPage from './pages/StaffPage/CertificationsPage';
import ConferencesPage from './pages/StaffPage/ConferencesPage';
import JournalsPage from './pages/StaffPage/JournalsPage';
import BookChaptersPage from './pages/StaffPage/BookChaptersPage';
import EventsOrganizedPage from './pages/StaffPage/EventsOrganizedPage';
import HIndex from './pages/StaffPage/HIndex';
import ResourcePersonPage from './pages/StaffPage/ResourcePersonPage';
import SeedMoneyPage from './pages/StaffPage/SeedMoneyPage';
import RecognitionPage from './pages/StaffPage/RecognitionPage';
import PatentDevelopmentPage from './pages/StaffPage/PatentDevelopmentPage';
import ProjectMentorPage from './pages/StaffPage/ProjectMentorPage';
import ScholarManagementPage from './pages/StaffPage/ScholarManagementPage';
import EducationPage from './pages/StaffPage/EducationPage';
import ProjectProposalPage from './pages/StaffPage/ProjectProposal';
import PersonalForm from './pages/StaffPage/PersonalForm';
import OverDashboardPage from './pages/StaffPage/DashboardPage';
import StaffActivitiesPage from './pages/admin/StaffActivities';
import StudentActivitiesPage from "./pages/admin/StudentActivities";

function App() {
  const location = useLocation();

  // Define routes where the Sidebar should NOT appear
  const noSidebarRoutes = ["/", "/forgot-password"];

  // Check if the current route is in the noSidebarRoutes array or starts with /reset-password
  const shouldShowSidebar =
    !noSidebarRoutes.includes(location.pathname) &&
    !location.pathname.startsWith("/reset-password");

  return (
    <div className="min-h-screen">
      {/* Show Sidebar only if the route is not in noSidebarRoutes and not a reset-password route */}
      {shouldShowSidebar && <Sidebar />}

      {/* Main Content Area */}
      <div className={shouldShowSidebar ? "ml-64 p-4 mt-4" : ""}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/staff-list" element={<StaffList />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/staff" element={<Dashboard />} />
          <Route path="/sheet" element={<Sheet />} />
          <Route path="/myward" element={<MyWard />} />
          <Route path="/staff-activities" element={<StaffActivitiesPage />} />
          <Route path="/student-activities" element={<StudentActivitiesPage/>}/>
          <Route path="/bulk" element={<Bulk />} />

          {/* Nested Student Routes */}
          <Route path="/student" element={<StudentBackground />} />
          <Route path="/student-background" element={<StudentBackground />} />
          <Route path="/student-personal-details" element={<StudentPersonalDetails />} />
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route path="/student-event-attended" element={<StudentEventAttended />} />
          <Route path="/student-event-organized" element={<StudentEventOrganized />} />
          <Route path="/student-certificates" element={<StudentCertificate />} />
          <Route path="/student-online-courses" element={<StudentOnlineCourses />} />
          <Route path="/student-achievements" element={<StudentAchievements />} />
          <Route path="/student-internships" element={<StudentInternship />} />
          <Route path="/student-scholarships" element={<StudentScholarship />} />
          <Route path="/student-leave" element={<StudentLeave />} />
          <Route path="/student-profile" element={<MyProfile />} />
          <Route path="/student-biodata/:userId" element={<StudentBioData />} />

          {/* Fixed staff personal info route */}
          {/* New Staff Dashboard and Management Routes */}
          <Route path="/staff-dashboard" element={<DashboardPage />} />
                    <Route path="/staffdashboard" element={<OverDashboardPage />} />

          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/industry" element={<IndustryPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/conferences" element={<ConferencesPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          <Route path="/book-chapters" element={<BookChaptersPage />} />
          <Route path="/events-organized" element={<EventsOrganizedPage />} />
          <Route path="/h-index" element={<HIndex />} />
          <Route path="/resource-person" element={<ResourcePersonPage />} />
          <Route path="/seed-money" element={<SeedMoneyPage />} />
          <Route path="/recognition" element={<RecognitionPage />} />
          <Route path="/patent-product" element={<PatentDevelopmentPage />} />
          <Route path="/project-mentors" element={<ProjectMentorPage />} />
          <Route path="/scholars" element={<ScholarManagementPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/project-proposal" element={<ProjectProposalPage />} />
          <Route path="/personal" element={<PersonalForm />} />

          {/* Forgot Password and Reset Password Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;