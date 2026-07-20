// CheckServerStatus.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import StringHost from "./Functions/ConnectionString";

const CheckServerStatus = ({ children }) => {
  const [serverStatus, setServerStatus] = useState({ server: 'up', database: 'up' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get(`${StringHost()}/health`);
        //console.log(response)
        /*if (response.ok) {
          const status = await response.json();
          setServerStatus(status);
        } else {
          setServerStatus({ server: 'down', database: 'down' });
        }*/
      } catch (error) {
        setServerStatus({ server: 'down', database: 'down' });
      }
    };

    checkServerStatus();
  }, []);

  useEffect(() => {
    if (serverStatus.server === 'down' || serverStatus.database === 'down') {
      navigate('/server-down');
    }
  }, [serverStatus, navigate]);

  return children;
};

export default CheckServerStatus;