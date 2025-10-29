import React, { useState, useEffect } from 'react';

// Simple Chart Component
const SimpleChart = ({ data, type = 'bar', height = 200, className = '' }) => {
  // Handle both Chart.js format and simple array format
  let chartData = data;
  
  if (data && data.datasets && data.labels) {
    // Convert Chart.js format to simple format
    chartData = data.labels.map((label, index) => ({
      label: label,
      value: data.datasets[0].data[index] || 0
    }));
  }
  
  // Ensure data is an array
  if (!Array.isArray(chartData)) {
    chartData = [];
  }
  
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 1;
  
  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-gradient-to-t from-violet-500 to-purple-600 rounded-t transition-all duration-500 hover:from-violet-600 hover:to-purple-700"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '4px'
            }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-xs text-gray-600 mt-1 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <svg className="w-full h-full" viewBox={`0 0 ${chartData.length * 100} ${height}`}>
      <polyline
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        points={chartData.map((item, index) => 
          `${index * 100 + 50},${height - (item.value / maxValue) * height}`
        ).join(' ')}
      />
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );

  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {chartData.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const x1 = 100 + 80 * Math.cos(currentAngle * Math.PI / 180);
          const y1 = 100 + 80 * Math.sin(currentAngle * Math.PI / 180);
          const x2 = 100 + 80 * Math.cos((currentAngle + angle) * Math.PI / 180);
          const y2 = 100 + 80 * Math.sin((currentAngle + angle) * Math.PI / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={`hsl(${index * 60}, 70%, 60%)`}
              className="transition-all duration-300 hover:opacity-80"
              title={`${item.label}: ${item.value}`}
            />
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="h-48 flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, change, changeType = 'neutral', icon, description, className = '' }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {change && (
          <div className={`text-sm font-semibold ${getChangeColor()}`}>
            {getChangeIcon()} {change}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8, label, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
            {label && <div className="text-sm text-gray-600">{label}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Table Component
const DataTable = ({ data, columns, className = '', sortable = true }) => {
  // Ensure data and columns are valid arrays
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [sortedData, setSortedData] = useState(safeData);

  useEffect(() => {
    setSortedData(safeData);
  }, [safeData]);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...safeData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedData(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`overflow-x-auto rounded-2xl shadow-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/80 backdrop-blur-sm">
          <tr>
            {safeColumns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${sortable ? 'cursor-pointer hover:text-gray-700' : ''}
                `}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortable && <span className="text-xs">{getSortIcon(column.key)}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white/90 backdrop-blur-sm divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50/80 transition-colors duration-200">
              {safeColumns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Data Visualization Component
const DataVisualization = ({ 
  type = 'chart',
  data = [],
  config = {},
  className = '',
  title,
  description 
}) => {
  // Ensure data is valid
  const safeData = Array.isArray(data) ? data : [];
  
  const renderContent = () => {
    switch (type) {
      case 'chart':
        return (
          <SimpleChart
            data={data}
            type={config.chartType || 'bar'}
            height={config.height || 200}
            className={className}
          />
        );
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        );
      case 'progress':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safeData.map((item, index) => (
              <ProgressRing
                key={index}
                progress={item.progress}
                label={item.label}
                size={config.size || 120}
                strokeWidth={config.strokeWidth || 8}
              />
            ))}
          </div>
        );
      case 'table':
        return (
          <DataTable
            data={safeData}
            columns={config.columns || []}
            sortable={config.sortable !== false}
            className={className}
          />
        );
      default:
        return <div>Unsupported visualization type: {type}</div>;
    }
  };

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default DataVisualization;
export { SimpleChart, StatCard, ProgressRing, DataTable };
