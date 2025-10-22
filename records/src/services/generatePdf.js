import axios from 'axios';

const generatePdf = async (data) => {
  try {
    // Resolve userId from data or localStorage
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const userId = data?.studentData?.Userid
      || data?.studentData?.studentUser?.Userid
      || data?.studentData?.studentUser?.UserId
      || data?.studentData?.studentUser?.id
      || data?.studentData?.id
      || storedUserId;
    if (!userId) {
      throw new Error('User ID not found');
    }
    // Call backend API to get PDF as blob
    const response = await axios.get(`http://localhost:4000/api/student/student-report/${userId}`, {
      responseType: 'blob',
    });
    // Return the blob data for frontend to handle (preview or download)
    return response.data;
  } catch (error) {
    console.error('Error fetching PDF from backend:', error);
    throw error;
  }
};

export default generatePdf;
