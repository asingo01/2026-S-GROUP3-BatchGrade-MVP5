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
    { id: '1001', name: 'Garen Crownguard', score: '92%' },
    { id: '1002', name: 'Wu Kong', score: '88%' },
    { id: '1003', name: 'Quinn Valor', score: '95%' },
    { id: '1004', name: 'Govos Usan', score: '84%' }
  ],
  'Assignment 2': [
    { id: '1001', name: 'Garen Crownguard', score: '95%' },
    { id: '1002', name: 'Wu Kong', score: '90%' },
    { id: '1003', name: 'Quinn Valor', score: '91%' },
    { id: '1004', name: 'Govos Usan', score: '89%' }
  ]
}

// =============================================================================
// Gradebook page component
// Displays the highest score each student achieved for the selected assignment
// =============================================================================
function Gradebook(): React.JSX.Element {
  // State variable that tracks which assignment is currently selected
  const [selectedAssignment, setSelectedAssignment] = useState('Assignment 1')

  // Tracks text entered in the search box
  const [searchTerm, setSearchTerm] = useState('')

  // Tracks which sorting option is selected
  const [sortOption, setSortOption] = useState('name-asc')

  // Retrieve the student list corresponding to the selected assignment
  const students = gradebookData[selectedAssignment as keyof typeof gradebookData]

  // Filter students by name or ID based on search input
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm)
  )

  // Sort filtered students based on selected sort option
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    // name ascending
    if (sortOption === 'name-asc') {
      return a.name.localeCompare(b.name)
    }

    // name descending
    if (sortOption === 'name-desc') {
      return b.name.localeCompare(a.name)
    }

    // score ascending
    if (sortOption === 'score-asc') {
      return parseInt(a.score) - parseInt(b.score)
    }

    // score descending
    if (sortOption === 'score-desc') {
      return parseInt(b.score) - parseInt(a.score)
    }

    return 0
  })

  // Calculate class statistics from the sorted student list
  const numericScores = sortedStudents.map((student) => parseInt(student.score))

  const averageScore =
    numericScores.length > 0
      ? Math.round(numericScores.reduce((sum, score) => sum + score, 0) / numericScores.length)
      : 0

  const highestScore = numericScores.length > 0 ? Math.max(...numericScores) : 0
  const lowestScore = numericScores.length > 0 ? Math.min(...numericScores) : 0
  // end class statistics calculation

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

      {/* Student search input */}
      <div style={{ margin: '16px 0' }}>
        <label htmlFor="student-search">Search Student: </label>
        <input
          id="student-search"
          type="text"
          placeholder="Enter student name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: '8px', padding: '6px', width: '260px' }}
        />
      </div>

      {/* Sort dropdown */}
      <div style={{ margin: '16px 0' }}>
        <label htmlFor="sort-select">Sort By: </label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ marginLeft: '8px', padding: '6px' }}
        >
          <option value="name-asc">Student Name (A-Z)</option>
          <option value="name-desc">Student Name (Z-A)</option>
          <option value="score-asc">Highest Score (Low to High)</option>
          <option value="score-desc">Highest Score (High to Low)</option>
        </select>
      </div>

      {/* Table displaying students and their highest scores */}

      {/* Class statistics summary */}
      <div style={{ display: 'flex', gap: '24px', margin: '20px 0', fontWeight: 'bold' }}>
        <div>Class Average: {averageScore}%</div>
        <div>Highest Score: {highestScore}%</div>
        <div>Lowest Score: {lowestScore}%</div>
      </div>

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
          {sortedStudents.map((student) => (
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
