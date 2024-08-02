//@todo: Twenty future - enhance to handle cors issue instead of disabling it
import { useEffect } from 'react';
import './App.css';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import axios from 'axios';
// import styles from "./Dashboard.module.css";
export default function Dashboard() {
  const getToken = async () => {
    const response = await fetch('http://localhost:3000/campaign/dashboard',{
      method: 'POST',
    });
    const token = await response.json();
    return token.token
  };
  useEffect(() => {
    const mountPoint:any=document.getElementById('dashboard')
    const embed = async () => {
      await embedDashboard({
        id: '9837afcd-7c43-45e9-9ba9-d40fd2d3c259', // given by the Superset embedding UI
        supersetDomain: 'http://localhost:8088',
        mountPoint: mountPoint, // html element in which iframe render
        fetchGuestToken: () => getToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
        debug: true,
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
