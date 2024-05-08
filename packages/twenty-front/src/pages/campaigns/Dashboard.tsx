//@todo: Twenty future - enhance to handle cors issue instead of disabling it
import { useEffect } from 'react';
import './App.css';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import axios from 'axios';
// import styles from "./Dashboard.module.css";
export default function Dashboard() {
  const getToken = async () => {
    const response = await fetch('http://localhost:3001/campaign/dashboard',{
      method: 'POST',
    });
    const token = await response.json();
    return token.access_Token
  };
  useEffect(() => {
    const embed = async () => {
      await embedDashboard({
        id: '', // given by the Superset embedding UI
        supersetDomain: 'http://localhost:8088',
        mountPoint: document.getElementById('dashboard'), // html element in which iframe render
        fetchGuestToken: () => getToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
        debug: true,
        hideTitle: true,
        filters: {
          expanded: false,
        },
      });
    };
    if (document.getElementById('dashboard')) {
      embed();
    }
  }, []);

  const superset = {
    width: '100%',
    height: '100%', // Replace 'your-background-value' with the actual background value
  };

  return (
    <>
      <div className="superset" style={superset}>
        <div id="dashboard" className="embedded-superset" />
      </div>
    </>
  );
}
