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
    {
      id: '1001',
      name: 'Garen Crownguard',
      score: '92%',
      submissions: 3,
      lastSubmitted: '2026-03-10 11:42 AM',
      status: 'Submitted'
    },
    {
      id: '1002',
      name: 'Wu Kong',
      score: '88%',
      submissions: 2,
      lastSubmitted: '2026-03-10 09:15 AM',
      status: 'Submitted'
    },
    {
      id: '1003',
      name: 'Quinn Valor',
      score: '95%',
      submissions: 4,
      lastSubmitted: '2026-03-11 02:30 PM',
      status: 'Submitted'
    },
    {
      id: '1004',
      name: 'Govos Usan',
      score: '--',
      submissions: 0,
      lastSubmitted: '--',
      status: 'Missing'
    }
  ],
  'Assignment 2': [
    {
      id: '1001',
      name: 'Garen Crownguard',
      score: '95%',
      submissions: 4,
      lastSubmitted: '2026-03-12 10:05 AM',
      status: 'Submitted'
    },
    {
      id: '1002',
      name: 'Wu Kong',
      score: '90%',
      submissions: 3,
      lastSubmitted: '2026-03-11 04:20 PM',
      status: 'Submitted'
    },
    {
      id: '1003',
      name: 'Quinn Valor',
      score: '91%',
      submissions: 2,
      lastSubmitted: '2026-03-12 08:45 AM',
      status: 'Submitted'
    },
    {
      id: '1004',
      name: 'Govos Usan',
      score: '--',
      submissions: 0,
      lastSubmitted: '--',
      status: 'Missing'
    }
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

  // Tracks whether only missing submissions should be shown
  const [showMissingOnly, setShowMissingOnly] = useState(false)

  // Retrieve the student list corresponding to the selected assignment
  const students = gradebookData[selectedAssignment as keyof typeof gradebookData]

  // Filter students by name or ID based on search input
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.includes(searchTerm)

    const matchesMissingFilter = showMissingOnly ? student.status === 'Missing' : true

    return matchesSearch && matchesMissingFilter
  })

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

  // Keep only students with valid numeric scores for statistics
  const validScores = students
    .filter((student) => student.score !== '--')
    .map((student) => parseInt(student.score))

  const averageScore =
    validScores.length > 0
      ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1)
      : '--'

  const highestScore = validScores.length > 0 ? Math.max(...validScores) : '--'
  const lowestScore = validScores.length > 0 ? Math.min(...validScores) : '--'
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
        <div>
          <span>Class Average: {averageScore === '--' ? '--' : `${averageScore}%`}</span>
          <span style={{ marginLeft: '24px' }}>
            Highest Score: {highestScore === '--' ? '--' : `${highestScore}%`}
          </span>
          <span style={{ marginLeft: '24px' }}>
            Lowest Score: {lowestScore === '--' ? '--' : `${lowestScore}%`}
          </span>
        </div>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        {/* Table header */}
        <thead>
          <tr>
            <th style={cellStyle}>Student ID</th>
            <th style={cellStyle}>Student Name</th>
            <th style={cellStyle}>Highest Score</th>
            <th style={cellStyle}>Submission Count</th>
            <th style={cellStyle}>Last Submission Time</th>
            <th style={cellStyle}>Status</th>
          </tr>
        </thead>

        {/* Table body generated dynamically from student data */}
        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student.id}>
              <td style={cellStyle}>{student.id}</td>
              <td style={cellStyle}>{student.name}</td>
              <td style={cellStyle}>{student.score}</td>
              <td style={cellStyle}>{student.submissions}</td>
              <td style={cellStyle}>{student.lastSubmitted}</td>
              <td style={cellStyle}>{student.status}</td>
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
