import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStudent } from "../../contexts/StudentContext";
import { FaSearch, FaUserGraduate, FaUndo, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const backendUrl = "http://localhost:4000";

const MyWard = () => {
  const navigate=useNavigate();
  const { students, loading, departments } = useStudent();
  const [staffId, setStaffId] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default items per page
  const backendUrl = "http://localhost:4000";

  // Adjust items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4); // Smaller screens
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8); // Medium screens
      } else {
        setItemsPerPage(12); // Larger screens
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchStaffId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`${backendUrl}/api/get-staff-by-user`, {
          params: { userId },
          ...config,
        });

        if (response.data.staffId) {
          setStaffId(response.data.staffId);
        } else {
          console.error("Staff ID not found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching StaffId:", error.response?.data || error.message);
      }
    };

    fetchStaffId();
  }, []);

  useEffect(() => {
    if (staffId) {
      const assignedStudents = students.filter((student) => student.staffId === staffId);
      setFilteredStudents(assignedStudents);
    }
  }, [staffId, students]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const displayedStudents = filteredStudents.filter(
    (student) =>
      student.username.toLowerCase().includes(searchTerm) ||
      student.regno.toLowerCase().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedStudents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(displayedStudents.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    console.log("Fetched students:", students);
  }, [students]);

  

  const handleView = (student) => {
    navigate(`/student-biodata/${student.Userid}`); // Navigate to biodata page
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-purple-50 to-blue-purple-100 p-6 ml-64 mt-16 flex flex-col overflow-hidden">
      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by Reg No or Username"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-blue-purple-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-purple-500 text-sm"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="p-2 bg-gradient-to-r from-blue-purple-500 to-blue-purple-600 text-white rounded-lg flex items-center justify-center hover:from-blue-purple-600 hover:to-blue-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-purple-500 transition text-sm"
          >
            <FaUndo className="mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 flex-1 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="min-w-full">
              {/* Conditionally render the table header */}
              {displayedStudents.length > 0 && (
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Batch</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Reg No</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
              )}
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((student) => {
                    const department = Array.isArray(departments)
                      ? departments.find((dept) => dept.Deptid === student.Deptid)?.Deptacronym || "N/A"
                      : "N/A";

                    return (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        {/* Student Profile Image */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={`${backendUrl}${student.image}`}
                            alt={`${student.username}'s avatar`}
                          />
                        </td>
                        {/* Student Name */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.username}
                        </td>
                        {/* Student Department */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {department}
                        </td>
                        {/* Student Batch */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.batch}
                        </td>
                        {/* Student Reg No */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.regno}
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleView(student)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Conditionally render pagination controls */}
          {totalPages > 1 && (
            <div className="bg-gray-50 py-4 px-6 border-t">
              <div className="flex justify-between">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing Student Details */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedStudent.username || "Unknown"}</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col items-center">
              {/* Student Image */}
              {selectedStudent.image ? (
                <img
                  src={selectedStudent.image}
                  alt={`${selectedStudent.username || "Unknown"}'s avatar`}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FaUserGraduate className="w-16 h-16 text-blue-500" />
                </div>
              )}
              {/* Placeholder for Additional Details */}
              <div className="text-center">
                <p className="text-gray-600">Reg No: {selectedStudent.regno || "No Reg No"}</p>
                <p className="text-gray-600">Batch: {selectedStudent.batch || "No batch"}</p>
                <p className="text-gray-600">Department: {departments.find((dept) => dept.Deptid === selectedStudent.Deptid)?.Deptacronym || "N/A"}</p>
                <p className="text-gray-600 mt-4">More details coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWard;