
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = (e) => {
    e.preventDefault();
    //navigate('/'); // Navigate back to the desired path
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row>
        <Col className="text-center">
          <Alert variant="danger" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
            <i className="fas fa-sad-tear" style={{ fontSize: '60px', color: '#f44336' }}></i>
            <h1 className="mt-3">User - Unauthorized</h1>
            <p>The page you are looking for does not exist.</p>
            {/* Link to go back */}
            {/*<a href="/dashboard" onClick={handleGoBack} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
              Click here to go back
            </a>*/}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;

//author: Rodrigo Cuello
