import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  // Map color classes to gradient pairs
  const gradients = {
    'bg-teal-600': 'from-teal-500 to-emerald-600',
    'bg-yellow-600': 'from-amber-500 to-orange-600',
    'bg-red-600': 'from-rose-500 to-red-600',
    'bg-green-600': 'from-emerald-500 to-green-600',
    'bg-blue-600': 'from-blue-500 to-indigo-600',
  };

  const gradient = gradients[color] || 'from-teal-500 to-emerald-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center space-x-4">
        <div className={`bg-gradient-to-br ${gradient} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{text}</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">{number}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
