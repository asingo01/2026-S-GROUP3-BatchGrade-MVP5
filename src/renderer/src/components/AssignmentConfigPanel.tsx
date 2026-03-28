import { useEffect, useState } from 'react'
import type { Assignment } from '../../../shared/types'

/**
 * @brief Local form state used by AssignmentConfigPanel.
 *
 * @details
 * This state mirrors the instructor-facing form fields for FR9, FR10, and FR11.
 * It keeps assignment separate from the list of saved assignments.
 */
type FormState = {
  title: string
  sectionId: string
  dueDate: string
  gradingCriteria: string
  solutionType: 'file' | 'text'
  expectedOutputText: string
}

/**
 * @brief Empty/default form values for a new assignment.
 *
 * @return Default AssignmentConfigPanel form state.
 */
const emptyForm: FormState = {
  title: '',
  sectionId: '',
  dueDate: '',
  gradingCriteria: '',
  solutionType: 'text',
  expectedOutputText: ''
}

/**
 * @brief Assignment configuration panel for MVP-5.
 *
 * @details
 * This component implements the renderer-side UI for:
 * - FR9: Instructor-defined assignment creation
 * - FR10: Instructor solution input mode selection (file or text)
 * - FR11: Assignment solution submission/saving
 *
 * The component:
 * - loads assignments on mount
 * - allows creating a new assignment
 * - allows editing an existing assignment
 * - allows deleting an assignment
 * - validates required input before submission
 *
 * @return React JSX element for the assignment configuration panel.
 */
export function AssignmentConfigPanel(): React.JSX.Element {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingUuid, setEditingUuid] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * @brief File currently selected by the instructor.
   *
   * @details
   * This is only used when solutionType === 'file'.
   * For now, the UI stores the selected file name and passes a placeholder path
   * value until full main-process file persistence is wired in.
   */
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  /**
   * @brief Loads all assignments from the preload API.
   *
   * @return Promise that resolves when assignments have been loaded.
   *
   * @throws Error if the preload or IPC layer fails.
   */
  const loadAssignments = async (): Promise<void> => {
    const result = await window.api.assignments.getAll()
    setAssignments(result)
  }

  /**
   * @brief Loads assignments when the component mounts.
   *
   * @return Nothing.
   */
  useEffect(() => {
    let isMounted = true

    window.api.assignments
      .getAll()
      .then((result) => {
        if (isMounted) {
          setAssignments(result)
        }
      })
      .catch((e: unknown) => {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Something went wrong.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  /**
   * @brief Starts editing an existing assignment.
   *
   * @param assignment The assignment selected for editing.
   * @return Nothing.
   */
  function startEdit(assignment: Assignment): void {
    setEditingUuid(assignment.uuid)
    setForm({
      title: assignment.title ?? '',
      sectionId: assignment.sectionId ?? '',
      dueDate: new Date(assignment.dueDate * 1000).toISOString().split('T')[0] ?? '',
      gradingCriteria: assignment.gradingCriteria ?? '',
      solutionType: (assignment.solutionType ?? 'text') as 'file' | 'text',
      expectedOutputText: assignment.expectedOutputText ?? ''
    })
    setSelectedFile(null)
    setDeleteConfirm(null)
    setError(null)
  }

  /**
   * @brief Cancels edit mode and resets the form.
   *
   * @return Nothing.
   */
  function cancelEdit(): void {
    setEditingUuid(null)
    setForm(emptyForm)
    setSelectedFile(null)
    setDeleteConfirm(null)
    setError(null)
  }

  /**
   * @brief Validates the current form before create/update.
   *
   * @return True if the form is valid; otherwise false.
   */
  function validateForm(): boolean {
    const trimmedTitle = form.title.trim()
    const trimmedSectionId = form.sectionId.trim()
    const trimmedDueDate = form.dueDate.trim()
    const trimmedCriteria = form.gradingCriteria.trim()
    const trimmedExpectedOutput = form.expectedOutputText.trim()

    if (!trimmedTitle) {
      setError('Assignment name is required.')
      return false
    }

    if (!trimmedSectionId) {
      setError('Section ID is required.')
      return false
    }

    if (!trimmedDueDate) {
      setError('Due date is required.')
      return false
    }

    if (!trimmedCriteria) {
      setError('Grading criteria is required.')
      return false
    }

    if (form.solutionType === 'text' && !trimmedExpectedOutput) {
      setError('Expected output text is required for text solution mode.')
      return false
    }

    if (form.solutionType === 'file' && !selectedFile && !editingUuid) {
      setError('Please select a solution file.')
      return false
    }

    setError(null)
    return true
  }

  /**
   * @brief Creates a new assignment or updates an existing one.
   *
   * @details
   * For file mode, this version stores the selected file name and a temporary
   * placeholder path value. Once your Electron main-process file-saving logic
   * is ready, replace that placeholder with the real persisted path returned
   * from IPC.
   *
   * @return Promise that resolves when the save operation completes.
   */
  async function handleSubmit(): Promise<void> {
    if (!validateForm()) {
      return
    }

    const trimmedTitle = form.title.trim()
    // const trimmedDueDate = form.dueDate.trim()
    const trimmedCriteria = form.gradingCriteria.trim()
    const trimmedExpectedOutput = form.expectedOutputText.trim()
    const dueDateInt = Math.floor(new Date(form.dueDate).getTime() / 1000)

    try {
      if (editingUuid) {
        await window.api.assignments.update({
          uuid: editingUuid,
          title: trimmedTitle,
          dueDate: dueDateInt,
          gradingCriteria: trimmedCriteria,
          solutionType: form.solutionType,
          solutionFileName: form.solutionType === 'file' ? selectedFile?.name : undefined,
          /**
           * Replace this with a real saved file path later when
           * main-process file persistence is implemented.
           */
          solutionFilePath:
            form.solutionType === 'file' && selectedFile
              ? `pending://${selectedFile.name}`
              : undefined,
          expectedOutputText: form.solutionType === 'text' ? trimmedExpectedOutput : undefined
        })
      } else {
        await window.api.assignments.create({
          title: trimmedTitle,
          sectionId: form.sectionId.trim(),
          dueDate: dueDateInt,
          gradingCriteria: trimmedCriteria,
          solutionType: form.solutionType,
          solutionFileName: form.solutionType === 'file' ? (selectedFile?.name ?? null) : null,
          solutionFilePath:
            form.solutionType === 'file' && selectedFile ? `pending://${selectedFile.name}` : null,
          expectedOutputText: form.solutionType === 'text' ? trimmedExpectedOutput : null,
          createdByUserUuid: null
        })
      }

      setForm(emptyForm)
      setSelectedFile(null)
      setEditingUuid(null)
      await loadAssignments()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  /**
   * @brief Deletes an assignment by UUID.
   *
   * @param uuid UUID of the assignment to delete.
   * @return Promise that resolves when deletion completes.
   */
  async function handleDelete(uuid: string): Promise<void> {
    await window.api.assignments.delete(uuid)
    setDeleteConfirm(null)
    await loadAssignments()
  }

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <div>
          <h2>Assignment Configuration</h2>
          <p>
            assignments · {assignments.length} row
            {assignments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {editingUuid && (
          <button onClick={cancelEdit} className="btn-ghost">
            cancel edit
          </button>
        )}
      </div>

      <div className="panel-form">
        <input
          type="text"
          placeholder="Assignment name"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="panel-input"
        />

        <input
          type="text"
          placeholder="Section ID"
          value={form.sectionId}
          onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
          className="panel-input"
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          className="panel-input"
        />

        <textarea
          placeholder="Grading criteria"
          value={form.gradingCriteria}
          onChange={(e) => setForm((f) => ({ ...f, gradingCriteria: e.target.value }))}
          className="panel-input"
          rows={4}
        />

        <div className="panel-section">
          <label>
            <input
              type="radio"
              name="solutionType"
              checked={form.solutionType === 'text'}
              onChange={() =>
                setForm((f) => ({
                  ...f,
                  solutionType: 'text'
                }))
              }
            />
            text solution
          </label>

          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="solutionType"
              checked={form.solutionType === 'file'}
              onChange={() =>
                setForm((f) => ({
                  ...f,
                  solutionType: 'file',
                  expectedOutputText: ''
                }))
              }
            />
            file solution
          </label>
        </div>

        {form.solutionType === 'text' ? (
          <textarea
            placeholder="Expected output text"
            value={form.expectedOutputText}
            onChange={(e) => setForm((f) => ({ ...f, expectedOutputText: e.target.value }))}
            className="panel-input"
            rows={5}
          />
        ) : (
          <div className="panel-section">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setSelectedFile(file)
              }}
              className="panel-input"
            />
            {selectedFile && <p className="text-xs">selected file: {selectedFile.name}</p>}
          </div>
        )}

        <button onClick={handleSubmit} className="btn-primary">
          {editingUuid ? 'update assignment' : '+ create assignment'}
        </button>

        {error && <div className="panel-error">⚠ {error}</div>}
      </div>

      {assignments.length === 0 ? (
        <div className="panel-empty">no assignments yet — add one above</div>
      ) : (
        <ul className="panel-list">
          {assignments.map((assignment) => (
            <li key={assignment.uuid} className="panel-list-item">
              <div>
                <strong>{assignment.title}</strong>
                <div>due: {new Date(assignment.dueDate * 1000).toLocaleDateString()}</div>
                <div>solution type: {assignment.solutionType}</div>

                {assignment.solutionType === 'text' && assignment.expectedOutputText && (
                  <div>expected output: {assignment.expectedOutputText}</div>
                )}

                {assignment.solutionType === 'file' && assignment.solutionFileName && (
                  <div>solution file: {assignment.solutionFileName}</div>
                )}

                <div>created: {new Date(assignment.createdAt * 1000).toLocaleString()}</div>
                <div>uuid: {assignment.uuid.slice(0, 8)}…</div>
              </div>

              <div className="panel-actions">
                <button onClick={() => startEdit(assignment)} className="btn-ghost text-xs">
                  edit
                </button>

                {deleteConfirm === assignment.uuid ? (
                  <button
                    onClick={() => handleDelete(assignment.uuid)}
                    className="btn-ghost text-xs text-red-400"
                  >
                    confirm?
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(assignment.uuid)}
                    className="btn-ghost text-xs"
                  >
                    delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AssignmentConfigPanel
