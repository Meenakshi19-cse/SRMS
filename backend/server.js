import express from 'express';
import { connectDB, sequelize } from './config/mysql.js'; 
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import leaveRoutes from './routes/student/leaveRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import tableRoutes from './routes/admin/tableRoutes.js';
import internRoutes from './routes/student/internshipRoutes.js';
import dashboardRoutes from './routes/student/DashboardRoutes.js';
import bulkRoutes from "./routes/admin/bulkRoutes.js";
import studentRoutes from "./routes/student/studentRoutes.js"
import staffRoutes from "./routes/staffRoutes.js";
import { applyAssociations, EventOrganized } from './models/index.js';

//import eventRoutes from './routes/student/eventRoutes.js';
import locationRoutes from './routes/student/locationRoutes.js';
import activityRoutes from "./routes/admin/activityRoutes.js";
import ScholarshipRoutes from './routes/student/ScholarshipRoutes.js';
import eventRoutes from './routes/student/eventRoutes.js'
import eventAttendedRoutes from './routes/student/eventAttendedRoutes.js';
import OnlineCoursesRoutes from './routes/student/onlinecourseRoute.js'
import achievementRoutes from './routes/student/achievementRoutes.js'
import courseRoutes from './routes/student/CourseRoutes.js';
import biodataRoutes from './routes/student/bioDataRoutes.js';

import prosubmittedRoutes from './routes/prosubmitted.js';
import eventsRoutes from './routes/events.js';
import industryRoutes from './routes/industry.js';
import certificationRoutes from './routes/certifications.js';
import bookChapterRoutes from './routes/bookChapters.js';
import otherRoutes from './routes/other.js';
import hIndexRoutes from './routes/hindex.js';
import proposalsRoutes from './routes/proposals.js';
import resourcePersonRoutes from './routes/resourcePerson.js';
import seedMoneyRoutes from './routes/seedMoney.js';
import recognitionRoutes from './routes/recognition.js';
import patentProductRoutes from './routes/patentProduct.js';
import sponsoredResearchRoutes from './routes/researchProject.js';
import projectMentorRoutes from './routes/projectMentor.js';
import eventsOrganizedRoutes from './routes/eventsOrganized.js';
import ScholarRoutes from './routes/scholarManagement.js';
import educationRoutes from './routes/education.js';
import paymentDetailsRoutes from './routes/paymentDetails.js';
import projectProposalRoutes from './routes/projectProposal.js';
import projectPaymentDetailsRoutes from './routes/projectPaymentDetails.js';
import personalRoutes from './routes/personal.js';
import pdfRoutes from './routes/student/studentPDF.js'; // Adjust path as needed


// 🆕 ADD THIS: Import the new admin panel routes
import adminPanelRoutes from './routes/adminPanelRoutes.js';
import studentPanelRoutes from './routes/studentPanel.js';

// Fixed import path
import PersonalInfo from './routes/staff/personalRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

applyAssociations(); // ✅ Ensure associations are applied

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend requests
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api', authRoutes); 
app.use('/api', adminRoutes);
app.use('/api', tableRoutes);
app.use('/api', internRoutes);
app.use('/api', dashboardRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api", studentRoutes);


// Fixed staff routes - removed extra slash and corrected path
app.use("/api/staff/", PersonalInfo);
app.use('/api', staffRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/proposals-submitted', prosubmittedRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/book-chapters', bookChapterRoutes);
app.use('/api/other', otherRoutes);
app.use('/api/h-index', hIndexRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/resource-person', resourcePersonRoutes);
app.use('/api/seed-money', seedMoneyRoutes);
app.use('/api/recognition', recognitionRoutes);
app.use('/api/patent-product', patentProductRoutes);
app.use('/api/sponsored-research', sponsoredResearchRoutes);
app.use('/api/project-mentors', projectMentorRoutes);
app.use('/api/events-organized', eventsOrganizedRoutes);
app.use('/api/scholars', ScholarRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/payment-details', paymentDetailsRoutes);
app.use('/api/project-proposal',projectProposalRoutes);
app.use('/api/project-payment-details', projectPaymentDetailsRoutes);
app.use('/api/personal', personalRoutes);

app.use('/api', adminPanelRoutes);
app.use('/api', studentPanelRoutes);

app.use('/api', locationRoutes);
app.use('/api', activityRoutes);
app.use('/api', ScholarshipRoutes);
app.use('/api', eventRoutes);
app.use('/api', eventAttendedRoutes);
app.use('/api', leaveRoutes);
app.use('/api', OnlineCoursesRoutes);
app.use('/api', achievementRoutes);
app.use('/api', courseRoutes);
app.use("/api", biodataRoutes);
app.use('/api/student', pdfRoutes);

// Sync Sequelize Models
sequelize.sync()
  .then(() => console.log("✅ Database synced successfully"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;