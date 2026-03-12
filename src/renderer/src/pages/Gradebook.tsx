/**
 * Gradebook Page
 * MVP-4 Frontend Implementation
 * Displays the highest score each student achieved for a selected assignment.
 */

import { useState } from 'react' // Import React hook used to manage component state

// =============================================================================
// Mock data representing gradebook records for each assignment.
// This data would come from the backend database (FR-7).
// =============================================================================
const gradebookData = {
  'Assignment 1': [
    { id: '1001', name: 'John Smith', score: '92%' },
    { id: '1002', name: 'Maria Lee', score: '88%' }
  ],
  'Assignment 2': [
    { id: '1001', name: 'John Smith', score: '95%' },
    { id: '1002', name: 'Maria Lee', score: '90%' }
  ]
}

// =============================================================================
// Gradebook page component
// Displays the highest score each student achieved for the selected assignment
// =============================================================================
function Gradebook(): React.JSX.Element {
  // State variable that tracks which assignment is currently selected
  const [selectedAssignment, setSelectedAssignment] = useState('Assignment 1')

  // Retrieve the student list corresponding to the selected assignment
  const students = gradebookData[selectedAssignment as keyof typeof gradebookData]

  return (
    // Main page container
    <div style={{ padding: '32px', color: 'white' }}>
      {/* Page title */}
      <h1>Assignment Gradebook</h1>

      {/* Assignment selection dropdown */}
      <div style={{ margin: '16px 0' }}>
        <label htmlFor="assignment-select">Select Assignment: </label>

        {/* Dropdown that allows instructors to switch assignments (FR-8) */}
        <select
          id="assignment-select"
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
        >
          <option>Assignment 1</option>
          <option>Assignment 2</option>
        </select>
      </div>

      {/* Table displaying students and their highest scores */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        {/* Table header */}
        <thead>
          <tr>
            <th style={cellStyle}>Student ID</th>
            <th style={cellStyle}>Student Name</th>
            <th style={cellStyle}>Highest Score</th>
          </tr>
        </thead>

        {/* Table body generated dynamically from student data */}
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={cellStyle}>{student.id}</td>
              <td style={cellStyle}>{student.name}</td>
              <td style={cellStyle}>{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Reusable styling for table cells
const cellStyle: React.CSSProperties = {
  border: '1px solid #555',
  padding: '10px',
  textAlign: 'left'
}

// Export the Gradebook component so it can be used in routing (App.tsx)
export default Gradebook
