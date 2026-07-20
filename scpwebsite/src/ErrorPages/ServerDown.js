import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import StringHost from "../Functions/ConnectionString";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ServerDown = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'failed'

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${StringHost()}/health`);
        if (response.data.server === 'up' && response.data.database === 'up') {
          setConnectionStatus('connected');
          // Redirect after a short delay to show the message
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setConnectionStatus('failed');
        }
      } catch (error) {
        setConnectionStatus('failed');
      }
    };

    checkServerStatus();
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="text-center" style={{ width: '18rem' }}>
        <Card.Body>
          {connectionStatus === 'connected' ? (
            <i class="fa-regular fa-face-smile" style={{ fontSize: '60px', color: '#00d100' }}></i>
          ) : (
            <i className="fas fa-sad-tear" style={{ fontSize: '60px', color: '#f44336' }}></i>
          )}
          <Card.Title className="mt-3">
            {connectionStatus === 'connected' ? 'Server Connected' : 'Server Down'}
          </Card.Title>
          {connectionStatus === 'checking' || connectionStatus === 'connected' ? (
            <>
              <Spinner animation="border" size="sm" />
              <Card.Text>
                {connectionStatus === 'checking'
                  ? 'Connecting to the server...'
                  : 'Server is connected, redirecting to the homepage...'}
              </Card.Text>
            </>
          ) : (
            <Alert variant="danger">
              Cannot connect to the server.
            </Alert>
          )}
          <Card.Text>
            Please contact the administrator.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ServerDown;
