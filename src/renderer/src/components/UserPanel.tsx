import { useEffect, useState } from 'react'
import type { User } from '../../main/database/schema'

type FormState = {
  email: string
  password: string
}
const emptyForm: FormState = { email: '', password: '' }

export function UserPanel(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingUuid, setEditingUuid] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const result = await window.api.users.getAll()
    setUsers(result)
  }

  function startEdit(user: User) {
    setEditingUuid(user.uuid)
    setForm({ email: user.email, password: user.password })
    setError(null)
  }

  function cancelEdit() {
    setEditingUuid(null)
    setForm(emptyForm)
    setError(null)
  }

  async function handleSubmit() {
    if (!form.email.trim() || !form.password.trim()) {
      setError('Both fields are required.')
      return
    }
    setError(null)
    try {
      if (editingUuid) {
        await window.api.users.update({ uuid: editingUuid, ...form })
      } else {
        await window.api.users.create(form)
      }
      setForm(emptyForm)
      setEditingUuid(null)
      await loadUsers()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  async function handleDelete(uuid: string) {
    await window.api.users.delete(uuid)
    setDeleteConfirm(null)
    await loadUsers()
  }

  return (
    <div className="w-full max-w-xl mt-6 rounded-lg overflow-hidden border border-white/10 bg-white/[0.04] text-sm">

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <span className="text-xs uppercase tracking-widest opacity-50">
          users · {users.length} row{users.length !== 1 ? 's' : ''}
        </span>
        {editingUuid && (
          <button onClick={cancelEdit} className="btn-ghost text-xs">
            cancel edit
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-white/10">
        <input
          type="email"
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="panel-input"
        />
        <input
          type="password"
          placeholder="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="panel-input"
        />
        <button onClick={handleSubmit} className="btn-primary text-xs whitespace-nowrap">
          {editingUuid ? 'update' : '+ add'}
        </button>
      </div>

      {error && (
        <div className="px-4 py-1.5 text-xs text-red-400 bg-red-400/10">
          ⚠ {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs opacity-30">
          no users yet — add one above
        </div>
      ) : (
        <ul>
          {users.map((user, i) => (
            <li
              key={user.uuid}
              className={`flex items-center justify-between gap-2 px-4 py-2.5 transition-colors
                ${i < users.length - 1 ? 'border-b border-white/[0.06]' : ''}
                ${editingUuid === user.uuid ? 'bg-sky-400/5' : 'hover:bg-white/[0.03]'}
              `}
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-medium truncate">{user.email}</span>
                <span className="text-xs opacity-35">
                  {new Date(user.createdAt * 1000).toLocaleString()} · {user.uuid.slice(0, 8)}…
                </span>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => startEdit(user)} className="btn-ghost text-xs">
                  edit
                </button>
                {deleteConfirm === user.uuid ? (
                  <button
                    onClick={() => handleDelete(user.uuid)}
                    className="btn-ghost text-xs text-red-400 border-red-400/40 hover:bg-red-400/10"
                  >
                    confirm?
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(user.uuid)}
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

export default UserPanel