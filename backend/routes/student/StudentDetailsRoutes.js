import express from 'express';
import {
  addStudentDetails,
  updateStudentDetails,
  getPendingStudentDetails,
  getApprovedStudentDetails,
  deleteStudentDetails,
  generateStudentReport
} from '../../controllers/student/StudentDetailsController.js';

import { getStudentBiodata } from '../../controllers/student/biodataController.js';

const router = express.Router();

// Add student details
router.post('/add', addStudentDetails);

// Update student details
router.put('/update/:id', updateStudentDetails);

// Get pending student details
router.get('/pending', getPendingStudentDetails);

// Get approved student details
router.get('/approved', getApprovedStudentDetails);

// Delete student details
router.delete('/delete/:id', deleteStudentDetails);

// Get full student biodata by userId for PDF generation
router.get('/biodata/:userId', getStudentBiodata);

// Generate student performance report PDF
router.get('/student-report/:userId', generateStudentReport);

export default router;
