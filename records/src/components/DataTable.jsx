import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';

const DataTable = ({ 
  data, 
  columns, 
  onView, 
  onEdit, 
  onDelete,
  isLoading = false
}) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and search logic
  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === bValue) return 0;

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const displayData = sortedData;

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-100 border-b border-gray-200"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-50 border-b border-gray-100 flex items-center px-6">
              <div className="flex items-center space-x-4 w-full">
                <div className="h-4 bg-gray-200 w-8"></div>
                <div className="h-4 bg-gray-200 w-32"></div>
                <div className="h-4 bg-gray-200 w-48"></div>
                <div className="h-4 bg-gray-200 w-24"></div>
                <div className="h-4 bg-gray-200 w-20"></div>
                <div className="h-4 bg-gray-200 w-28"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-200 shadow-sm">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-blue-200 bg-blue-50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={16} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto horizontal-scroll">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider w-16">
                  S.No
                </th>
                
                {columns.map((column) => (
                  <th 
                    key={column.field} 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors duration-200 select-none min-w-40"
                    onClick={() => handleSort(column.field)}
                  >
                    <div className="flex items-center justify-between group">
                      <span className="truncate">{column.header}</span>
                      <div className="flex flex-col ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronUp 
                          size={12} 
                          className={`${sortField === column.field && sortDirection === 'asc' ? 'text-white' : 'text-blue-200'} transition-colors`}
                        />
                        <ChevronDown 
                          size={12} 
                          className={`${sortField === column.field && sortDirection === 'desc' ? 'text-white' : 'text-blue-200'} transition-colors -mt-1`}
                        />
                      </div>
                    </div>
                  </th>
                ))}
                
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-blue-200">
              {displayData.map((row, index) => (
                <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-40">
                      <div className="max-w-xs truncate">
                        {column.render ? column.render(row) : row[column.field]}
                      </div>
                    </td>
                  ))}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title="Edit Record"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Horizontal Scrollbar Styles */}
      <style jsx>{`
        .horizontal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #e5e7eb;
        }
        
        .horizontal-scroll::-webkit-scrollbar {
          height: 12px;
        }
        
        .horizontal-scroll::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 0;
        }
        
        .horizontal-scroll::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 0;
          border: 1px solid #e5e7eb;
        }
        
        .horizontal-scroll::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
        
        .horizontal-scroll::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }
      `}</style>

      {/* Results Counter */}
      <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
        <p className="text-sm text-blue-600">
          Showing <span className="font-medium text-blue-800">{displayData.length}</span> records
          {searchTerm && (
            <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DataTable;