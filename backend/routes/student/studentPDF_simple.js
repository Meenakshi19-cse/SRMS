import express from 'express';
import PDFDocument from 'pdfkit';
import { sequelize } from '../../config/mysql.js';
import { QueryTypes } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate student report PDF
router.get('/student-report/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch basic student data only
    const studentData = await fetchStudentData(userId);

    if (!studentData.basicInfo) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=student-report.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Generate PDF content (only first page)
    await generatePDFContent(doc, studentData);

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Fetch basic student data from database
async function fetchStudentData(userId) {
  const data = {
    basicInfo: null
  };

  try {
    // Fetch basic student info only
    const basicInfo = await sequelize.query(`
      SELECT u.username, u.email, u.staffId, u.image,
             sd.regno, sd.batch, sd.gender, sd.date_of_birth as dob,
             CONCAT_WS(', ', sd.door_no, sd.street) as address,
             c.name as city, di.name as district, s.name as state,
             sd.pincode, sd.personal_phone as student_phone,
             sd.blood_group, sd.aadhar_card_no as aadhar_number,
             d.Deptname as department, d.Deptacronym as dept_code
      FROM users u
      LEFT JOIN student_details sd ON u.Userid = sd.Userid
      LEFT JOIN department d ON u.Deptid = d.Deptid
      LEFT JOIN cities c ON sd.cityID = c.id
      LEFT JOIN districts di ON sd.districtID = di.id
      LEFT JOIN states s ON sd.stateID = s.id
      WHERE u.Userid = ? AND u.role = 'Student'
    `, {
      replacements: [userId],
      type: QueryTypes.SELECT
    });

    if (basicInfo && basicInfo.length > 0) {
      data.basicInfo = basicInfo[0];
    }

  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }

  return data;
}

// Generate PDF content (single page only)
async function generatePDFContent(doc, data) {
  const { basicInfo } = data;

  // Improved layout constants
  const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };
  const CONTENT_WIDTH = doc.page.width - MARGINS.left - MARGINS.right;
  const LABEL_X = MARGINS.left;
  const VALUE_X = MARGINS.left + 140; // Increased for better alignment
  const VALUE_WIDTH = CONTENT_WIDTH - 140;

  // Color scheme
  const COLORS = {
    primary: '#1E40AF',      // Blue-800
    secondary: '#64748B',    // Slate-500
    text: '#1F2937',         // Gray-800
    textLight: '#6B7280',    // Gray-500
    accent: '#059669',       // Emerald-600
    warning: '#D97706',      // Amber-600
    border: '#E5E7EB'        // Gray-200
  };

  // Typography scale
  const TYPOGRAPHY = {
    title: { size: 20, weight: 'Bold' },
    sectionHeader: { size: 16, weight: 'Bold' },
    subsection: { size: 14, weight: 'Bold' },
    body: { size: 11, weight: 'Normal' },
    bodySmall: { size: 10, weight: 'Normal' },
    footer: { size: 9, weight: 'Normal' }
  };

  // Helper function to add page header
  const addPageHeader = (title = 'STUDENT REPORT') => {
    const headerY = 30;
    doc.font('Helvetica-Bold').fontSize(TYPOGRAPHY.title.size).fillColor(COLORS.primary)
       .text(title, MARGINS.left, headerY, { width: CONTENT_WIDTH, align: 'center' });

    // Add a subtle line below header
    const lineY = headerY + 25;
    doc.lineWidth(0.5)
       .moveTo(MARGINS.left, lineY)
       .lineTo(doc.page.width - MARGINS.right, lineY)
       .stroke(COLORS.border);
  };

  // Helper function to add page footer
  const addPageFooter = () => {
    const footerY = doc.page.height - 40;
    const pageNumber = doc.bufferedPageRange().start + 1;

    // Footer line
    doc.lineWidth(0.5)
       .moveTo(MARGINS.left, footerY)
       .lineTo(doc.page.width - MARGINS.right, footerY)
       .stroke(COLORS.border);

    // Footer text
    doc.font('Helvetica').fontSize(TYPOGRAPHY.footer.size).fillColor(COLORS.textLight)
       .text(`Generated on ${new Date().toLocaleString('en-IN')} | Student Activity Management System`,
             MARGINS.left, footerY + 8, { width: CONTENT_WIDTH, align: 'center' })
       .text(`Page ${pageNumber}`, doc.page.width - MARGINS.right - 50, footerY + 8, { align: 'right' });
  };

  // Helper function to add field with improved formatting
  const addField = (label, value, options = {}) => {
    const startY = doc.y;

    // Label
    doc.font('Helvetica-Bold').fontSize(TYPOGRAPHY.bodySmall.size).fillColor(COLORS.secondary)
       .text(label + ':', LABEL_X, startY);

    // Value
    doc.font('Helvetica').fontSize(TYPOGRAPHY.body.size).fillColor(COLORS.text)
       .text(value || 'N/A', VALUE_X, startY, {
         width: VALUE_WIDTH,
         lineGap: 6,
         continued: options.continued || false,
         ...options
       });

    doc.moveDown(0.4);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  // Title page with improved layout
  addPageHeader();

  // Student information section
  const titleY = 80;
  const imageX = 420;
  const imageY = 100;
  const imageSize = 120;

  // Student name - prominent display
  doc.font('Helvetica-Bold').fontSize(18).fillColor(COLORS.primary)
     .text((basicInfo.username || 'Student Name').toUpperCase(), LABEL_X, titleY);

  doc.moveDown(0.5);

  // Department and code
  doc.font('Helvetica-Bold').fontSize(TYPOGRAPHY.subsection.size).fillColor(COLORS.accent)
     .text('Department Information', LABEL_X, doc.y);

  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(TYPOGRAPHY.body.size).fillColor(COLORS.text);

  if (basicInfo.department) {
    doc.text(`Department: ${basicInfo.department}`, LABEL_X + 10, doc.y);
    doc.moveDown(0.3);
  }

  if (basicInfo.dept_code) {
    doc.text(`Department Code: ${basicInfo.dept_code}`, LABEL_X + 10, doc.y);
    doc.moveDown(0.3);
  }

  // Contact information
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(TYPOGRAPHY.subsection.size).fillColor(COLORS.accent)
     .text('Contact Information', LABEL_X, doc.y);

  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(TYPOGRAPHY.body.size).fillColor(COLORS.text);

  addField('Email', basicInfo.email);
  addField('Registration Number', basicInfo.regno);
  addField('Batch', basicInfo.batch);
  addField('Phone', basicInfo.student_phone || basicInfo.phone);

  // Address information
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(TYPOGRAPHY.subsection.size).fillColor(COLORS.accent)
     .text('Address Information', LABEL_X, doc.y);

  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(TYPOGRAPHY.body.size).fillColor(COLORS.text);

  const address = `${basicInfo.address || ''}${basicInfo.city ? ', ' + basicInfo.city : ''}${basicInfo.district ? ', ' + basicInfo.district : ''}${basicInfo.state ? ', ' + basicInfo.state : ''}${basicInfo.pincode ? ' - ' + basicInfo.pincode : ''}`;
  addField('Address', address, { width: VALUE_WIDTH });

  // Add student photo on the right side
  if (basicInfo.image) {
    const backendRoot = path.resolve(__dirname, '..', '..');
    const relativeImage = basicInfo.image.startsWith('/') ? basicInfo.image.slice(1) : basicInfo.image;
    const imagePath = path.join(backendRoot, relativeImage);
    console.log('Student image path:', imagePath);
    const exists = fs.existsSync(imagePath);
    console.log('Image file exists:', exists);
    if (exists) {
      try {
        doc.image(imagePath, imageX, imageY, {
          width: imageSize,
          height: imageSize,
          fit: [imageSize, imageSize],
          align: 'center',
          valign: 'center'
        });
      } catch (error) {
        console.warn('Error adding student image to PDF:', error);
      }
    } else {
      console.warn('Student image file not found, skipping image in PDF');
    }
  }

  // Generation info at bottom
  doc.moveDown(2);
  doc.font('Helvetica').fontSize(TYPOGRAPHY.bodySmall.size).fillColor(COLORS.textLight)
     .text(`Report Generated: ${new Date().toLocaleDateString('en-IN')}`, MARGINS.left, doc.y, { width: CONTENT_WIDTH, align: 'center' });

  // Add final footer
  addPageFooter();

  // Additional footer text
  doc.font('Helvetica').fontSize(TYPOGRAPHY.bodySmall.size).fillColor(COLORS.textLight)
     .text('This report was generated automatically and contains all student activities as recorded in the system.',
           MARGINS.left, doc.page.height - 80, { width: CONTENT_WIDTH, align: 'center' });
}

export default router;
