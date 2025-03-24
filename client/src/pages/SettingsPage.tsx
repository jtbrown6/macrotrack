import React, { useState, useEffect } from 'react';
import SettingsForm from '../components/SettingsForm';
import { Settings } from '../types';
import { getSettings, updateSettings, resetSettings } from '../utils/apiService';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError('');
        
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle updating settings
  const handleUpdateSettings = async (updatedSettings: Settings) => {
    try {
      setError('');
      const result = await updateSettings(updatedSettings);
      setSettings(result);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again.');
    }
  };
  
  // Handle resetting settings to defaults
  const handleResetSettings = async () => {
    try {
      setError('');
      const defaultSettings = await resetSettings();
      setSettings(defaultSettings);
    } catch (err) {
      console.error('Error resetting settings:', err);
      setError('Failed to reset settings. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="alert alert-danger">
        <p>Failed to load settings. Please try again later.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="settings-content">
        <SettingsForm
          settings={settings}
          onSave={handleUpdateSettings}
          onReset={handleResetSettings}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
