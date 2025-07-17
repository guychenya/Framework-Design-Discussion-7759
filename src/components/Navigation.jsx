import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiTarget, FiBarChart3, FiSettings, FiTrendingUp } = FiIcons;

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/' },
    { id: 'habits', label: 'Habits', icon: FiTarget, path: '/habits' },
    { id: 'statistics', label: 'Statistics', icon: FiBarChart3, path: '/statistics' },
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/settings' }
  ];

  const handleNavigation = (item) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 mb-8">
      <div className="flex items-center justify-between py-4">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <SafeIcon icon={FiTrendingUp} className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HabitFlow</h1>
            <p className="text-sm text-gray-500">Build better habits</p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;