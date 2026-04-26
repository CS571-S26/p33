import { Button, Container, Nav, Navbar, Spinner } from 'react-bootstrap'
import { BsBoxArrowRight, BsBriefcase, BsGoogle } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'

function AppNavBar() {
  const {
    authConfigured,
    authLoading,
    user,
    signInWithGoogle,
    signOutUser,
  } = useAuthContext()
  const accountLabel = user?.displayName || user?.email || 'Signed in'

  return (
    <Navbar expand="lg" sticky="top" className="app-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="app-brand">
          <span className="app-brand-mark" aria-hidden>
            <BsBriefcase />
          </span>
          <span>Job Application Tracker</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end className="app-nav-link">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/applications" className="app-nav-link">
              Applications
            </Nav.Link>
            <Nav.Link as={NavLink} to="/resources" className="app-nav-link">
              Resources
            </Nav.Link>
          </Nav>
          <div className="navbar-auth ms-lg-3 mt-3 mt-lg-0">
            {!authConfigured ? (
              <Navbar.Text className="navbar-auth-text">
                Local demo mode
              </Navbar.Text>
            ) : authLoading ? (
              <Navbar.Text className="navbar-auth-text">
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden
                  className="me-2"
                />
                Checking session...
              </Navbar.Text>
            ) : user ? (
              <>
                <Navbar.Text className="navbar-auth-text">
                  {accountLabel}
                </Navbar.Text>
                <Button variant="outline-secondary" size="sm" onClick={signOutUser}>
                  <BsBoxArrowRight aria-hidden className="me-1" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGoogle}>
                <BsGoogle aria-hidden className="me-1" />
                Sign in with Google
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavBar
