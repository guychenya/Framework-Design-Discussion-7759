import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEdit2, FiTrash2, FiTarget, FiBook, FiActivity, FiHeart, FiStar, FiX } = FiIcons;

const Habits = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'wellness',
    color: 'bg-blue-500',
    targetDays: 7
  });

  const categories = [
    { id: 'wellness', name: 'Wellness', icon: FiHeart, color: 'bg-pink-500' },
    { id: 'fitness', name: 'Fitness', icon: FiActivity, color: 'bg-red-500' },
    { id: 'learning', name: 'Learning', icon: FiBook, color: 'bg-green-500' },
    { id: 'productivity', name: 'Productivity', icon: FiTarget, color: 'bg-blue-500' },
    { id: 'creative', name: 'Creative', icon: FiStar, color: 'bg-purple-500' }
  ];

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'wellness',
      color: 'bg-blue-500',
      targetDays: 7
    });
    setEditingHabit(null);
    setShowModal(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      color: habit.color,
      targetDays: habit.targetDays
    });
    setShowModal(true);
  };

  const handleDelete = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600 mt-1">Manage your daily habits</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Habit</span>
        </motion.button>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${habit.color}`}>
                <SafeIcon icon={FiTarget} className="text-white text-xl" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(habit)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <SafeIcon icon={FiEdit2} />
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{habit.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
                {habit.category}
              </span>
              <span className="text-gray-500">
                {habit.targetDays} days/week
              </span>
            </div>
          </motion.div>
        ))}
        
        {habits.length === 0 && (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiTarget} className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No habits yet</p>
            <p className="text-gray-400">Create your first habit to get started</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Morning Meditation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of your habit"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-12 h-12 rounded-xl ${color} ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Days per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.targetDays}
                    onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    {editingHabit ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Habits;