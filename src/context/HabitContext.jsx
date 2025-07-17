import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isToday, parseISO, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedCompletions = localStorage.getItem('completions');
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Initialize with sample habits
      const sampleHabits = [
        {
          id: 1,
          name: 'Morning Meditation',
          description: 'Start the day with mindfulness',
          category: 'wellness',
          color: 'bg-blue-500',
          icon: 'Brain',
          targetDays: 7,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Read for 30 minutes',
          description: 'Daily reading habit',
          category: 'learning',
          color: 'bg-green-500',
          icon: 'Book',
          targetDays: 7,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Exercise',
          description: 'Stay active and healthy',
          category: 'fitness',
          color: 'bg-red-500',
          icon: 'Activity',
          targetDays: 5,
          createdAt: new Date().toISOString()
        }
      ];
      setHabits(sampleHabits);
    }
    
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  // Save to localStorage whenever habits or completions change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id, updatedHabit) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updatedHabit } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    // Clean up completions for this habit
    const newCompletions = { ...completions };
    Object.keys(newCompletions).forEach(date => {
      if (newCompletions[date][id]) {
        delete newCompletions[date][id];
      }
    });
    setCompletions(newCompletions);
  };

  const toggleCompletion = (habitId, date = format(new Date(), 'yyyy-MM-dd')) => {
    setCompletions(prev => {
      const newCompletions = { ...prev };
      if (!newCompletions[date]) {
        newCompletions[date] = {};
      }
      newCompletions[date][habitId] = !newCompletions[date][habitId];
      return newCompletions;
    });
  };

  const isHabitCompleted = (habitId, date = format(new Date(), 'yyyy-MM-dd')) => {
    return completions[date] && completions[date][habitId];
  };

  const getHabitStreak = (habitId) => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (isHabitCompleted(habitId, dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeeklyProgress = (habitId) => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const completedDays = daysInWeek.filter(day => 
      isHabitCompleted(habitId, format(day, 'yyyy-MM-dd'))
    ).length;
    
    return {
      completed: completedDays,
      total: 7,
      percentage: Math.round((completedDays / 7) * 100)
    };
  };

  const getTotalCompletions = (habitId) => {
    let total = 0;
    Object.values(completions).forEach(dayCompletions => {
      if (dayCompletions[habitId]) {
        total++;
      }
    });
    return total;
  };

  const value = {
    habits,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isHabitCompleted,
    getHabitStreak,
    getWeeklyProgress,
    getTotalCompletions
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};