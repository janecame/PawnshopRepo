import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row>
        <Col className="text-center">
          <Alert variant="danger" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
            <i className="fas fa-sad-tear" style={{ fontSize: '60px', color: '#f44336' }}></i>
            <h1 className="mt-3">404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
