import { Button, Container, Nav, Navbar, Spinner } from 'react-bootstrap'
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
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Job Application Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/applications">
              Applications
            </Nav.Link>
            <Nav.Link as={NavLink} to="/resources">
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
                <Button variant="outline-light" size="sm" onClick={signOutUser}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="light" size="sm" onClick={signInWithGoogle}>
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
