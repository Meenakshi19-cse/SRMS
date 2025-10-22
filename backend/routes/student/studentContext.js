import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentDataContext = createContext();

export const useStudentData = () => {
  const context = useContext(StudentDataContext);
  if (!context) {
    throw new Error('useStudentData must be used within StudentDataProvider');
  }
  return context;
};

export const StudentDataProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [internships, setInternships] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch student basic data
  const fetchStudentData = useCallback(async (userId) => {
    try {
      // First get user data
      const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
      const userData = userResponse.data;
      
      // Then get student details
      const detailsResponse = await axios.get(`${API_BASE_URL}/student-details/user/${userId}`);
      const studentDetails = detailsResponse.data;
      
      // Combine the data
      const combinedData = {
        ...studentDetails,
        studentUser: userData,
        username: userData.username,
        email: userData.email,
        department: userData.department || userData.Deptname,
        rollNumber: studentDetails.regno || userData.staffId
      };
      
      setStudentData(combinedData);
      return combinedData;
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw error;
    }
  }, [API_BASE_URL]);

  // Fetch courses for a specific user
  const fetchCourses = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/online-courses/user/${userId}`);
      const coursesData = response.data || [];
      setCourses(coursesData);
      return coursesData;
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch internships for a specific user
  const fetchInternships = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/internships/user/${userId}`);
      const internshipsData = response.data || [];
      setInternships(internshipsData);
      return internshipsData;
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch organized events for a specific user
  const fetchOrganizedEvents = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-organized/user/${userId}`);
      const eventsData = response.data || [];
      setOrganizedEvents(eventsData);
      return eventsData;
    } catch (error) {
      console.error('Error fetching organized events:', error);
      setOrganizedEvents([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch attended events for a specific user
  const fetchAttendedEvents = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-attended/user/${userId}`);
      const eventsData = response.data || [];
      setAttendedEvents(eventsData);
      return eventsData;
    } catch (error) {
      console.error('Error fetching attended events:', error);
      setAttendedEvents([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch scholarships for a specific user
  const fetchScholarships = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scholarships/user/${userId}`);
      const scholarshipsData = response.data || [];
      setScholarships(scholarshipsData);
      return scholarshipsData;
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setScholarships([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch leaves for a specific user
  const fetchLeaves = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student-leaves/user/${userId}`);
      const leavesData = response.data || [];
      setLeaves(leavesData);
      return leavesData;
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch achievements for a specific user
  const fetchAchievements = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/achievements/user/${userId}`);
      const achievementsData = response.data || [];
      setAchievements(achievementsData);
      return achievementsData;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
      return [];
    }
  }, [API_BASE_URL]);

  // Fetch all data for a user
  const fetchAllData = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.allSettled([
        fetchStudentData(userId),
        fetchCourses(userId),
        fetchInternships(userId),
        fetchOrganizedEvents(userId),
        fetchAttendedEvents(userId),
        fetchScholarships(userId),
        fetchLeaves(userId),
        fetchAchievements(userId)
      ]);

      // Check if any critical data failed
      if (results[0].status === 'rejected') {
        throw new Error('Failed to fetch student data');
      }

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const dataTypes = ['Student Data', 'Courses', 'Internships', 'Organized Events', 
                           'Attended Events', 'Scholarships', 'Leaves', 'Achievements'];
          console.warn(`Failed to fetch ${dataTypes[index]}:`, result.reason);
        }
      });

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error fetching all data:', error);
      setError(error.message || 'Failed to fetch student data');
      setLoading(false);
      throw error;
    }
  }, [fetchStudentData, fetchCourses, fetchInternships, fetchOrganizedEvents, 
      fetchAttendedEvents, fetchScholarships, fetchLeaves, fetchAchievements]);

  // Refresh data
  const refreshData = useCallback(async (userId) => {
    return fetchAllData(userId);
  }, [fetchAllData]);

  const value = {
    studentData,
    courses,
    internships,
    organizedEvents,
    attendedEvents,
    scholarships,
    leaves,
    achievements,
    loading,
    error,
    fetchStudentData,
    fetchCourses,
    fetchInternships,
    fetchOrganizedEvents,
    fetchAttendedEvents,
    fetchScholarships,
    fetchLeaves,
    fetchAchievements,
    fetchAllData,
    refreshData
  };

  return (
    <StudentDataContext.Provider value={value}>
      {children}
    </StudentDataContext.Provider>
  );
};

export default StudentDataContext;