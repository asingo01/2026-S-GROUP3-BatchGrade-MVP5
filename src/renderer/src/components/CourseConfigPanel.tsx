import { useEffect, useState } from 'react'

/**
 * @brief Represents the form state for course creation.
 *
 * @details
 * This state stores the user-entered values needed to create a course.
 */
type CourseFormState = {
  courseCode: string
  title: string
  description: string
  credits: string
}

/**
 * @brief Default empty form values for course creation.
 */
const emptyCourseForm: CourseFormState = {
  courseCode: '',
  title: '',
  description: '',
  credits: ''
}

/**
 * @brief Minimal renderer-safe course shape.
 *
 * @details
 * This matches the course data returned from the backend query layer.
 */
type Course = {
  uuid: string
  courseCode: string
  title: string
  description: string | null
  credits: number
}

/**
 * @brief Course configuration panel.
 *
 * @details
 * This component allows an instructor to:
 * - view all courses
 * - create a new course
 *
 * It uses the preload API exposed on window.api.
 *
 * @return React JSX element for the course configuration panel.
 */
export default function CourseConfigPanel(): React.JSX.Element {
  const [courses, setCourses] = useState<Course[]>([])
  const [form, setForm] = useState<CourseFormState>(emptyCourseForm)
  const [error, setError] = useState<string | null>(null)

  /**
   * @brief Loads all courses from the backend.
   *
   * @return Promise that resolves when courses are loaded.
   */
  async function loadCourses(): Promise<void> {
    try {
      const result = await (window.api.courses.getAll as () => Promise<Course[]>)()
      setCourses(result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load courses.')
    }
  }

  /**
   * @brief Loads courses when the component mounts.
   *
   * @return Nothing.
   */
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const result = await (window.api.courses.getAll as () => Promise<Course[]>)()
        setCourses(result)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load courses.')
      }
    }

    void load()
  }, [])

  /**
   * @brief Validates the course form input.
   *
   * @return True if the form is valid; otherwise false.
   */
  function validateForm(): boolean {
    if (!form.courseCode.trim()) {
      setError('Course code is required.')
      return false
    }

    if (!form.title.trim()) {
      setError('Course title is required.')
      return false
    }

    if (!form.credits.trim()) {
      setError('Credits are required.')
      return false
    }

    const creditsNumber = Number(form.credits)
    if (Number.isNaN(creditsNumber) || creditsNumber <= 0) {
      setError('Credits must be a positive number.')
      return false
    }

    setError(null)
    return true
  }

  /**
   * @brief Creates a new course using the current form values.
   *
   * @return Promise that resolves when the course is created.
   */
  async function handleCreateCourse(): Promise<void> {
    if (!validateForm()) {
      return
    }

    try {
      await (
        window.api.courses.create as (data: {
          courseCode: string
          title: string
          description: string | null
          credits: number
        }) => Promise<Course>
      )({
        courseCode: form.courseCode.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        credits: Number(form.credits)
      })

      setForm(emptyCourseForm)
      await loadCourses()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create course.')
    }
  }

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <div>
          <h2>Course Configuration</h2>
          <p>
            courses · {courses.length} row{courses.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="panel-form">
        <input
          type="text"
          placeholder="Course code"
          value={form.courseCode}
          onChange={(e) => setForm((f) => ({ ...f, courseCode: e.target.value }))}
          className="panel-input"
        />

        <input
          type="text"
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="panel-input"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="panel-input"
          rows={3}
        />

        <input
          type="number"
          placeholder="Credits"
          value={form.credits}
          onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))}
          className="panel-input"
        />

        <button onClick={() => void handleCreateCourse()} className="btn-primary">
          + create course
        </button>

        {error && <div className="panel-error">⚠ {error}</div>}
      </div>

      {courses.length === 0 ? (
        <div className="panel-empty">no courses yet — add one above</div>
      ) : (
        <ul className="panel-list">
          {courses.map((course) => (
            <li key={course.uuid} className="panel-list-item">
              <div>
                <strong>{course.courseCode}</strong>
                <div>{course.title}</div>
                <div>credits: {course.credits}</div>
                {course.description && <div>{course.description}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
