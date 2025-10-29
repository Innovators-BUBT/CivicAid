import React, { useState, useEffect } from 'react';

const DashboardStats = ({ stats = [] }) => {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const target = stat.value;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timers[index]);
        }
        
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = Math.floor(current);
          return newStats;
        });
      }, duration / steps);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats]);

  const getStatIcon = (type) => {
    switch (type) {
      case 'complaints':
        return (
          <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'resolved':
        return (
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'volunteers':
        return (
          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'tasks':
        return (
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'revenue':
        return (
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  const getStatColor = (type) => {
    switch (type) {
      case 'complaints': return 'from-indigo-500 to-purple-600';
      case 'resolved': return 'from-emerald-500 to-teal-600';
      case 'pending': return 'from-amber-500 to-orange-600';
      case 'volunteers': return 'from-purple-500 to-violet-600';
      case 'tasks': return 'from-blue-500 to-cyan-600';
      case 'revenue': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return (
        <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 10.586 15.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend < 0) {
      return (
        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L12 9.414 15.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={stat.title} className="stat-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                  {getStatIcon(stat.type)}
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${
                    stat.trend > 0 ? 'text-emerald-600' : 
                    stat.trend < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {Math.abs(stat.trend)}%
                  </span>
                </div>
              </div>
              
              <div className="mb-1">
                <p className="text-2xl font-bold text-gray-900">
                  {stat.prefix || ''}{animatedStats[index]?.toLocaleString() || '0'}{stat.suffix || ''}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 font-medium">
                {stat.title}
              </p>
              
              {stat.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              )}
            </div>
            
            {/* Progress Ring */}
            <div className="relative">
              <svg className="h-16 w-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`text-${stat.type === 'resolved' ? 'emerald' : stat.type === 'pending' ? 'amber' : 'indigo'}-500`}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${(animatedStats[index] / stat.value) * 100}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">
                  {Math.round((animatedStats[index] / stat.value) * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Hover Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getStatColor(stat.type)} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;




