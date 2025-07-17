import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiUpload, FiTrash2, FiInfo, FiMoon, FiSun, FiBell } = FiIcons;

const Settings = () => {
  const { habits, completions } = useHabits();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const exportData = () => {
    const data = {
      habits,
      completions,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.habits && data.completions) {
            localStorage.setItem('habits', JSON.stringify(data.habits));
            localStorage.setItem('completions', JSON.stringify(data.completions));
            alert('Data imported successfully! Please refresh the page.');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('habits');
      localStorage.removeItem('completions');
      alert('All data cleared! Please refresh the page.');
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences and data</p>
      </div>

      {/* Preferences */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiBell} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Get reminded about your habits</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={darkMode ? FiMoon : FiSun} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiDownload} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-600">Download your habits and progress</p>
              </div>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiUpload} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Import Data</h3>
                <p className="text-sm text-gray-600">Restore from backup file</p>
              </div>
            </div>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiTrash2} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Clear All Data</h3>
                <p className="text-sm text-red-600">Permanently delete all habits and progress</p>
              </div>
            </div>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">App Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiInfo} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Version</h3>
                <p className="text-sm text-gray-600">HabitFlow v1.0.0</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Habits</p>
                <p className="font-semibold text-gray-900">{habits.length}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Completions</p>
                <p className="font-semibold text-gray-900">
                  {Object.values(completions).reduce((total, day) => 
                    total + Object.values(day).filter(Boolean).length, 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;