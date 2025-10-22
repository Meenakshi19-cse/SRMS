import { User, StudentDetails, Department } from "../../models/index.js";
import { sendEmail } from "../../utils/emailService.js";
import generatePdf from "../student/generatePDF.js";

export const addStudentDetails = async (req, res) => {
  try {
    const {
      Userid,
      regno,
      Deptid,
      batch,
      Semester,
      staffId,
      date_of_joining,
      date_of_birth,
      blood_group,
      tutorEmail,
      personal_email,
      first_graduate,
      aadhar_card_no,
      student_type,
      mother_tongue,
      identification_mark,
      extracurricularID,
      religion,
      caste,
      community,
      gender,
      seat_type,
      section,
      door_no,
      street,
      cityID,
      districtID,
      stateID,
      countryID,
      pincode,
      personal_phone,
      skillrackProfile
    } = req.body;

    // Validate User ID
    if (!Userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user details
    const user = await User.findByPk(Userid);
    if (!user || !user.email) {
      return res.status(404).json({ message: "Student email not found" });
    }

    // Check if student details already exist
    const existingDetails = await StudentDetails.findOne({ where: { Userid } });
    if (existingDetails) {
      return res.status(400).json({ message: "Student details already exist for this user" });
    }

    // Create student details
    const studentDetails = await StudentDetails.create({
      Userid,
      regno,
      Deptid,
      batch,
      Semester,
      staffId,
      date_of_joining,
      date_of_birth,
      blood_group,
      tutorEmail,
      personal_email,
      first_graduate,
      aadhar_card_no,
      student_type,
      mother_tongue,
      identification_mark,
      extracurricularID,
      religion,
      caste,
      community,
      gender,
      seat_type,
      section,
      door_no,
      street,
      cityID,
      districtID,
      stateID,
      countryID,
      pincode,
      personal_phone,
      skillrackProfile,
      pending: true,
      tutor_approval_status: false,
      Approved_by: null,
      approved_at: null,
      Created_by: user.Userid,
      Updated_by: user.Userid,
    });

    // Send email to tutor
    const emailResponse = await sendEmail({
      from: user.email,
      to: tutorEmail,
      subject: "New Student Details Pending Approval",
      text: `Dear Tutor,

A student has submitted new student details for your approval. Please find the details below:

Student Regno: ${regno}
Student Name: ${user.username || "N/A"}
Department: ${Deptid}
Batch: ${batch}
Semester: ${Semester}

The student details are currently pending your approval. Please review the details and either approve or reject them.

Best Regards,
Student Management System

Note: If you have any issues, feel free to contact the system administrator.`,
    });

    // Handle email sending errors
    if (!emailResponse.success) {
      console.error("⚠️ Failed to send email:", emailResponse.error);
    }

    // Return success response
    res.status(201).json({
      message: "Student details submitted for approval. Tutor notified.",
      studentDetails,
    });
  } catch (error) {
    console.error("❌ Error adding student details:", error);
    res.status(500).json({ message: "Error adding student details", error });
  }
};

export const updateStudentDetails = async (req, res) => {
  const { id } = req.params;
  const {
    Userid,
    regno,
    Deptid,
    batch,
    Semester,
    staffId,
    date_of_joining,
    date_of_birth,
    blood_group,
    tutorEmail,
    personal_email,
    first_graduate,
    aadhar_card_no,
    student_type,
    mother_tongue,
    identification_mark,
    extracurricularID,
    religion,
    caste,
    community,
    gender,
    seat_type,
    section,
    door_no,
    street,
    cityID,
    districtID,
    stateID,
    countryID,
    pincode,
    personal_phone,
    skillrackProfile
  } = req.body;

  try {
    // Find the student details by ID
    const studentDetails = await StudentDetails.findByPk(id);
    if (!studentDetails) {
      return res.status(404).json({ message: "Student details not found" });
    }

    if (studentDetails.Userid !== parseInt(Userid)) {
      return res.status(403).json({ message: "Unauthorized to update these student details" });
    }

    // Find the user
    const user = await User.findByPk(Userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update student details
    studentDetails.regno = regno ?? studentDetails.regno;
    studentDetails.Deptid = Deptid ?? studentDetails.Deptid;
    studentDetails.batch = batch ?? studentDetails.batch;
    studentDetails.Semester = Semester ?? studentDetails.Semester;
    studentDetails.staffId = staffId ?? studentDetails.staffId;
    studentDetails.date_of_joining = date_of_joining ?? studentDetails.date_of_joining;
    studentDetails.date_of_birth = date_of_birth ?? studentDetails.date_of_birth;
    studentDetails.blood_group = blood_group ?? studentDetails.blood_group;
    studentDetails.tutorEmail = tutorEmail ?? studentDetails.tutorEmail;
    studentDetails.personal_email = personal_email ?? studentDetails.personal_email;
    studentDetails.first_graduate = first_graduate ?? studentDetails.first_graduate;
    studentDetails.aadhar_card_no = aadhar_card_no ?? studentDetails.aadhar_card_no;
    studentDetails.student_type = student_type ?? studentDetails.student_type;
    studentDetails.mother_tongue = mother_tongue ?? studentDetails.mother_tongue;
    studentDetails.identification_mark = identification_mark ?? studentDetails.identification_mark;
    studentDetails.extracurricularID = extracurricularID ?? studentDetails.extracurricularID;
    studentDetails.religion = religion ?? studentDetails.religion;
    studentDetails.caste = caste ?? studentDetails.caste;
    studentDetails.community = community ?? studentDetails.community;
    studentDetails.gender = gender ?? studentDetails.gender;
    studentDetails.seat_type = seat_type ?? studentDetails.seat_type;
    studentDetails.section = section ?? studentDetails.section;
    studentDetails.door_no = door_no ?? studentDetails.door_no;
    studentDetails.street = street ?? studentDetails.street;
    studentDetails.cityID = cityID ?? studentDetails.cityID;
    studentDetails.districtID = districtID ?? studentDetails.districtID;
    studentDetails.stateID = stateID ?? studentDetails.stateID;
    studentDetails.countryID = countryID ?? studentDetails.countryID;
    studentDetails.pincode = pincode ?? studentDetails.pincode;
    studentDetails.personal_phone = personal_phone ?? studentDetails.personal_phone;
    studentDetails.skillrackProfile = skillrackProfile ?? studentDetails.skillrackProfile;
    studentDetails.Updated_by = Userid;
    studentDetails.pending = true;
    studentDetails.tutor_approval_status = false;
    studentDetails.Approved_by = null;
    studentDetails.approved_at = null;

    // Save the updated student details
    await studentDetails.save();

    // Send email to tutor if tutor's email is available
    if (tutorEmail) {
      const emailSubject = "Student Details Updated - Requires Review";
      const emailText = `Dear Tutor,

A student has updated their student details. Please review the updated details:

Student Regno: ${studentDetails.regno}
Student Name: ${user.username || "N/A"}
Department: ${studentDetails.Deptid}
Batch: ${studentDetails.batch}
Semester: ${studentDetails.Semester}

These student details are now pending approval. Please review the details.

Best Regards,
Student Management System

Note: If you have any issues, feel free to contact the system administrator.`;

      const emailResponse = await sendEmail({
        from: user.email,
        to: tutorEmail,
        subject: emailSubject,
        text: emailText,
      });

      if (!emailResponse.success) {
        console.error("⚠️ Failed to send email:", emailResponse.error);
      }
    } else {
      console.warn("⚠️ Tutor email not found. Email notification skipped.");
    }

    // Return success response
    res.status(200).json({
      message: "Student details updated successfully, tutor notified.",
      studentDetails,
    });
  } catch (error) {
    console.error("❌ Error updating student details:", error);
    res.status(500).json({ message: "Error updating student details", error: error.message });
  }
};

export const getPendingStudentDetails = async (req, res) => {
  try {
    const pendingStudentDetails = await StudentDetails.findAll({
      where: { pending: true },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["Userid", "username", "email"],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["Deptacronym"],
            },
          ],
        },
      ],
    });

    // Format the response
    const formattedStudentDetails = pendingStudentDetails.map((details) => {
      const { student, ...rest } = details.get({ plain: true });

      return {
        ...rest,
        username: student?.username || "N/A",
        department: student?.department?.Deptacronym || "N/A",
      };
    });

    res.status(200).json({ success: true, studentDetails: formattedStudentDetails });
  } catch (error) {
    console.error("Error fetching pending student details:", error.message);
    res.status(500).json({ success: false, message: "Error fetching pending student details" });
  }
};

export const getApprovedStudentDetails = async (req, res) => {
  try {
    const userId = req.user?.Userid || req.query.UserId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const approvedStudentDetails = await StudentDetails.findAll({
      where: { tutor_approval_status: true, Userid: userId },
      order: [["approved_at", "DESC"]],
    });

    return res.status(200).json(approvedStudentDetails);
  } catch (error) {
    console.error("Error fetching approved student details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const studentDetails = await StudentDetails.findByPk(id);
    if (!studentDetails) return;

    const user = await User.findByPk(studentDetails.Userid);

    if (!user) return;

    await StudentDetails.destroy({ where: { id } });

    sendEmail({
      to: user.email,
      subject: "Student Details Deleted Notification",
      text: `Dear ${user.username || "Student"},

Your student details have been removed.

If this was an error, contact the system administrator.

Best,
Student Management System`,
    });

    if (studentDetails.tutorEmail) {
      sendEmail({
        to: studentDetails.tutorEmail,
        subject: "Student Details Deleted Notification",
        text: `Dear Tutor,

The student details submitted by your student have been deleted:

Student Regno: ${studentDetails.regno}
Student Name: ${user.username || "N/A"}

If you need further details, contact the system administrator.

Best,
Student Management System`,
      });
    }

    res.status(200).json({ message: "Student details deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student details:", error);
    res.status(500).json({ message: "Error deleting student details", error });
  }
};

import { User, StudentDetails, Department, OnlineCourses, Internship, EventOrganized, EventAttended, Scholarship, StudentLeave, Achievement, City, District, State, Country } from "../../models/index.js";

export const generateStudentReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch student data and related models
    const studentData = await StudentDetails.findOne({
      where: { Userid: userId },
      include: [
        { model: User, as: 'studentUser', include: [{ model: Department, as: 'department' }] },
        { model: Department },
        { model: City, as: 'city' },
        { model: District, as: 'district' },
        { model: State, as: 'state' },
        { model: Country, as: 'country' }
      ],
    });

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    // Fetch related activities data
    const courses = await OnlineCourses.findAll({ where: { Userid: userId } });
    const internships = await Internship.findAll({ where: { Userid: userId } });
    const organizedEvents = await EventOrganized.findAll({ where: { Userid: userId } });
    const attendedEvents = await EventAttended.findAll({ where: { Userid: userId } });
    const scholarships = await Scholarship.findAll({ where: { Userid: userId } });
    const leaves = await StudentLeave.findAll({ where: { Userid: userId } });
    const achievements = await Achievement.findAll({ where: { Userid: userId } });

    // Generate PDF document
    const pdfBuffer = await generatePdf({
      studentData,
      courses,
      internships,
      organizedEvents,
      attendedEvents,
      scholarships,
      leaves,
      achievements,
    });

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=student-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating student report:', error);
    res.status(500).json({ message: 'Error generating student report', error: error.message });
  }
};
