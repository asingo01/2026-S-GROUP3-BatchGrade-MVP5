/**
 * DropdownMenu.tsx
 *
 * Description:
 * A reusable dropdown menu component that displays navigation items
 * when the menu is open. Used in the Navbar for collapsible navigation.
 */
import { useNavigate } from 'react-router-dom'

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * DropdownMenu Component
 *
 * Renders a dropdown menu with navigation items
 *
 * @param isOpen - Whether the menu should be visible
 * @param onClose - Callback to close the menu
 */
function DropdownMenu({ isOpen, onClose }: DropdownMenuProps): React.JSX.Element | null {
  const navigate = useNavigate()

  const handleNavigation = (path: string): void => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="dropdown-menu">
      {/*-----------------------------------------------------------
            Navigation Buttons
              Provide quick access to major system interfaces
            -----------------------------------------------------------*/}

      {/* Test navigate to Student Dashboard */}
      <button className="dropdown-item" onClick={() => handleNavigation('/studentdashboard')}>
        Student Dashboard
      </button>
      {/* Test navigate to Instructor Dashboard */}
      <button className="dropdown-item" onClick={() => handleNavigation('/instructordashboard')}>
        Instructor Dashboard
      </button>
      {/* Test navigate to Student Upload Interface */}
      <button className="dropdown-item" onClick={() => handleNavigation('/studentuploadinterface')}>
        Student Upload Interface
      </button>
      {/* Test navigate to Gradebook */}
      <button className="dropdown-item" onClick={() => handleNavigation('/gradebook')}>
        Gradebook
      </button>
      {/* Test navigate to Grading Interface */}
      <button className="dropdown-item" onClick={() => handleNavigation('/grading')}>
        Grading
      </button>
      {/* Test navigate to About Page */}
      <button className="dropdown-item" onClick={() => handleNavigation('/about')}>
        About
      </button>
    </div>
  )
}

export default DropdownMenu
