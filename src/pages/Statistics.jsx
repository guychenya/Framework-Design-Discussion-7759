import React from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import ReactECharts from 'echarts-for-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTarget, FiCalendar, FiAward } = FiIcons;

const Statistics = () => {
  const { habits, getHabitStreak, getWeeklyProgress, getTotalCompletions, isHabitCompleted } = useHabits();

  // Generate last 30 days data
  const getLast30DaysData = () => {
    const today = new Date();
    const last30Days = eachDayOfInterval({
      start: subDays(today, 29),
      end: today
    });

    return last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completions = habits.filter(habit => isHabitCompleted(habit.id, dateStr)).length;
      return {
        date: format(date, 'MMM dd'),
        completions,
        total: habits.length
      };
    });
  };

  const chartData = getLast30DaysData();

  const completionChartOption = {
    title: {
      text: 'Daily Completions (Last 30 Days)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>Completed: ${data.value}/${chartData[data.dataIndex].total} habits`;
      }
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.max(habits.length, 1)
    },
    series: [
      {
        name: 'Completions',
        type: 'line',
        data: chartData.map(d => d.completions),
        smooth: true,
        lineStyle: {
          color: '#6366f1',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.1)' }
            ]
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
  };

  const habitProgressOption = {
    title: {
      text: 'Weekly Progress by Habit',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value',
      max: 100
    },
    yAxis: {
      type: 'category',
      data: habits.map(h => h.name),
      axisLabel: {
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [
      {
        name: 'Progress',
        type: 'bar',
        data: habits.map(habit => {
          const progress = getWeeklyProgress(habit.id);
          return {
            value: progress.percentage,
            itemStyle: {
              color: habit.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3b82f6' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'green' ? '#10b981' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'red' ? '#ef4444' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'purple' ? '#8b5cf6' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'pink' ? '#ec4899' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'yellow' ? '#f59e0b' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'indigo' ? '#6366f1' :
                     habit.color.replace('bg-', '').replace('-500', '') === 'teal' ? '#14b8a6' : '#6b7280'
            }
          };
        }),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%'
        }
      }
    ],
    grid: {
      left: '20%',
      right: '10%',
      top: '15%',
      bottom: '10%'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">Track your progress and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Habits</p>
              <p className="text-3xl font-bold text-gray-900">{habits.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTarget} className="text-blue-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Best Streak</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.max(...habits.map(h => getHabitStreak(h.id)), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-green-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Completions</p>
              <p className="text-3xl font-bold text-gray-900">
                {habits.reduce((sum, habit) => sum + getTotalCompletions(habit.id), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiAward} className="text-purple-600 text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Weekly Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {habits.length > 0 
                  ? Math.round(habits.reduce((sum, habit) => sum + getWeeklyProgress(habit.id).percentage, 0) / habits.length)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="text-orange-600 text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ReactECharts option={completionChartOption} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {habits.length > 0 ? (
            <ReactECharts option={habitProgressOption} style={{ height: '400px' }} />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <SafeIcon icon={FiTarget} className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">No habits to display</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Habit Details */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Habit Details</h3>
        <div className="space-y-4">
          {habits.map((habit) => {
            const streak = getHabitStreak(habit.id);
            const weeklyProgress = getWeeklyProgress(habit.id);
            const totalCompletions = getTotalCompletions(habit.id);

            return (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${habit.color}`}>
                    <SafeIcon icon={FiTarget} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{habit.name}</h4>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{streak}</p>
                    <p className="text-gray-500">Current Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{weeklyProgress.percentage}%</p>
                    <p className="text-gray-500">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{totalCompletions}</p>
                    <p className="text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Statistics;