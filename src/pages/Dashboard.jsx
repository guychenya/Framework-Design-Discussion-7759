import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import { format, isToday } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiCircle, FiTrendingUp, FiTarget, FiAward, FiCalendar } = FiIcons;

const Dashboard = () => {
  const { habits, toggleCompletion, isHabitCompleted, getHabitStreak, getWeeklyProgress } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayCompletions = habits.filter(habit => isHabitCompleted(habit.id, today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((todayCompletions / totalHabits) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
        </h1>
        <p className="text-lg text-gray-600">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Progress</p>
              <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-sm text-gray-600">{todayCompletions} of {totalHabits} completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Habits</p>
              <p className="text-3xl font-bold text-gray-900">{totalHabits}</p>
              <p className="text-sm text-gray-600">Building consistency</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Best Streak</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.max(...habits.map(h => getHabitStreak(h.id)), 0)}
              </p>
              <p className="text-sm text-gray-600">Days in a row</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiAward} className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Habits */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Today's Habits</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <SafeIcon icon={FiCalendar} />
            <span>Today</span>
          </div>
        </div>

        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiTarget} className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No habits yet</p>
              <p className="text-gray-400">Create your first habit to get started</p>
            </div>
          ) : (
            habits.map((habit) => {
              const isCompleted = isHabitCompleted(habit.id, today);
              const streak = getHabitStreak(habit.id);
              const weeklyProgress = getWeeklyProgress(habit.id);

              return (
                <motion.div
                  key={habit.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleCompletion(habit.id, today)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${habit.color}`}>
                        <SafeIcon icon={FiTarget} className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                        <p className="text-sm text-gray-600">{habit.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{streak} day streak</p>
                        <p className="text-xs text-gray-500">{weeklyProgress.percentage}% this week</p>
                      </div>
                      <SafeIcon 
                        icon={isCompleted ? FiCheckCircle : FiCircle}
                        className={`text-2xl ${
                          isCompleted ? 'text-green-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;