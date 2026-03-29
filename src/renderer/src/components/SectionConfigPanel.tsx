import { useEffect, useState } from 'react'

/**
 * @brief Minimal renderer-safe course shape.
 */
type Course = {
  uuid: string
  courseCode: string
  title: string
  description: string | null
  credits: number
}

/**
 * @brief Minimal renderer-safe user shape.
 *
 * @details
 * This is used to populate the instructor selection list.
 */
type User = {
  uuid: string
  email: string
  password: string
  role: string
  createdAt: number
}

/**
 * @brief Minimal renderer-safe section shape.
 */
type Section = {
  uuid: string
  courseId: string
  instructorId: string
  semester: string
}

/**
 * @brief Represents the form state for section creation.
 */
type SectionFormState = {
  courseId: string
  instructorId: string
  semester: string
}

/**
 * @brief Default empty form values for section creation.
 */
const emptySectionForm: SectionFormState = {
  courseId: '',
  instructorId: '',
  semester: ''
}

/**
 * @brief Section configuration panel.
 *
 * @details
 * This component allows an instructor or admin to:
 * - view all sections
 * - create a new section
 * - select a valid course and instructor before saving
 *
 * @return React JSX element for the section configuration panel.
 */
export default function SectionConfigPanel(): React.JSX.Element {
  const [sections, setSections] = useState<Section[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [instructors, setInstructors] = useState<User[]>([])
  const [form, setForm] = useState<SectionFormState>(emptySectionForm)
  const [error, setError] = useState<string | null>(null)

  /**
   * @brief Loads all sections from the backend.
   *
   * @return Promise that resolves when sections are loaded.
   */
  async function loadSections(): Promise<void> {
    try {
      const result = await window.api.sections.getAll()
      setSections(result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load sections.')
    }
  }

  // eslint-disable-next-line prettier/prettier
//   /**
  //    * @brief Loads all courses from the backend.
  //    *
  //    * @return Promise that resolves when courses are loaded.
  //    */
  //   async function loadCourses(): Promise<void> {
  //     try {
  //       const result = await window.api.courses.getAll()
  //       setCourses(result)
  //     } catch (e: unknown) {
  //       setError(e instanceof Error ? e.message : 'Failed to load courses.')
  //     }
  //   }

  //   /**
  //    * @brief Loads all instructor users from the backend.
  //    *
  //    * @details
  //    * This version filters users by role in the renderer.
  //    *
  //    * @return Promise that resolves when instructors are loaded.
  //    */
  //   async function loadInstructors(): Promise<void> {
  //     try {
  //       const result = await window.api.users.getAll()
  //       setInstructors(result.filter((user: User) => user.role === 'instructor'))
  //     } catch (e: unknown) {
  //       setError(e instanceof Error ? e.message : 'Failed to load instructors.')
  //     }
  //   }

  /**
   * @brief Loads initial data when the component mounts.
   *
   * @return Nothing.
   */
  useEffect(() => {
    let isMounted = true

    const loadInitialData = async (): Promise<void> => {
      try {
        const [sectionsResult, coursesResult, usersResult] = await Promise.all([
          window.api.sections.getAll(),
          window.api.courses.getAll(),
          window.api.users.getAll()
        ])

        if (!isMounted) {
          return
        }

        setSections(sectionsResult)
        setCourses(coursesResult)
        setInstructors(usersResult.filter((user: User) => user.role === 'instructor'))
      } catch (e: unknown) {
        if (!isMounted) {
          return
        }

        setError(e instanceof Error ? e.message : 'Failed to load initial section data.')
      }
    }

    void loadInitialData()

    return () => {
      isMounted = false
    }
  }, [])

  /**
   * @brief Validates the section form input.
   *
   * @return True if the form is valid; otherwise false.
   */
  function validateForm(): boolean {
    if (!form.courseId) {
      setError('Course selection is required.')
      return false
    }

    if (!form.instructorId) {
      setError('Instructor selection is required.')
      return false
    }

    if (!form.semester.trim()) {
      setError('Semester is required.')
      return false
    }

    setError(null)
    return true
  }

  /**
   * @brief Creates a new section using the current form values.
   *
   * @return Promise that resolves when the section is created.
   */
  async function handleCreateSection(): Promise<void> {
    if (!validateForm()) {
      return
    }

    try {
      await window.api.sections.create({
        courseId: form.courseId,
        instructorId: form.instructorId,
        semester: form.semester.trim()
      })

      setForm(emptySectionForm)
      await loadSections()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create section.')
    }
  }

  /**
   * @brief Finds a course label for a section row.
   *
   * @param courseId UUID of the course.
   * @return Readable course label or the raw UUID if not found.
   */
  function getCourseLabel(courseId: string): string {
    const course = courses.find((c) => c.uuid === courseId)
    return course ? `${course.courseCode} — ${course.title}` : courseId
  }

  /**
   * @brief Finds an instructor label for a section row.
   *
   * @param instructorId UUID of the instructor.
   * @return Readable instructor label or the raw UUID if not found.
   */
  function getInstructorLabel(instructorId: string): string {
    const instructor = instructors.find((i) => i.uuid === instructorId)
    return instructor ? instructor.email : instructorId
  }

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <div>
          <h2>Section Configuration</h2>
          <p>
            sections · {sections.length} row{sections.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="panel-form">
        <select
          value={form.courseId}
          onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
          className="panel-input"
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.uuid} value={course.uuid}>
              {course.courseCode} — {course.title}
            </option>
          ))}
        </select>

        <select
          value={form.instructorId}
          onChange={(e) => setForm((f) => ({ ...f, instructorId: e.target.value }))}
          className="panel-input"
        >
          <option value="">Select instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.uuid} value={instructor.uuid}>
              {instructor.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
          className="panel-input"
        />

        <button onClick={() => void handleCreateSection()} className="btn-primary">
          + create section
        </button>

        {error && <div className="panel-error">⚠ {error}</div>}
      </div>

      {sections.length === 0 ? (
        <div className="panel-empty">no sections yet — add one above</div>
      ) : (
        <ul className="panel-list">
          {sections.map((section) => (
            <li key={section.uuid} className="panel-list-item">
              <div>
                <strong>{getCourseLabel(section.courseId)}</strong>
                <div>semester: {section.semester}</div>
                <div>instructor: {getInstructorLabel(section.instructorId)}</div>
                <div>uuid: {section.uuid.slice(0, 8)}…</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
