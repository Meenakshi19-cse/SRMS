import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { StudentProvider } from './contexts/StudentContext.jsx';
import { StaffProvider } from './contexts/StaffContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { InternProvider } from "./contexts/InternContext"; 
import { DashboardProvider } from "./contexts/DashboardContext"; 
import { OrganizedEventProvider } from "./contexts/OrganizedEventContext";
import { AttendedEventProvider } from "./contexts/AttendedEventContext";
import { AppProvider } from './contexts/AppContext.jsx';
import { LocationProvider } from './contexts/LocationContext.jsx';
import {ScholarshipProvider } from './contexts/ScholarshipContext.jsx'
import { LeaveProvider } from './contexts/LeaveContext.jsx';
import { OnlineCoursesProvider } from './contexts/OnlineCoursesContext.jsx';
import {AchievementProvider} from "./contexts/AchievementContext.jsx";
import { StudentDataProvider } from './contexts/studentDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <StudentDataProvider>
    <AchievementProvider>
    <OnlineCoursesProvider>
    <LeaveProvider>
    < OrganizedEventProvider>
    <ScholarshipProvider>
    <LocationProvider>
    <AppProvider>
          < AttendedEventProvider>
     
    <InternProvider> 
    <DashboardProvider> 
    <UserProvider>
    <StudentProvider>
      <StaffProvider>
      <BrowserRouter>
        <App /> 
    </BrowserRouter>
      </StaffProvider>
    </StudentProvider>
    </UserProvider>
    </DashboardProvider>
    </InternProvider>
    
    </ AttendedEventProvider>
    </AppProvider>
    </LocationProvider>
    </ScholarshipProvider>
    </OrganizedEventProvider>
    </LeaveProvider>
    </OnlineCoursesProvider>
    </AchievementProvider>
    </StudentDataProvider>
   
  </StrictMode>
);
