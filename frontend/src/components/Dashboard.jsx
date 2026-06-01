import React from 'react';
import { BarChart3, ClipboardList, Percent, Timer } from 'lucide-react';

const Dashboard = ({ tests }) => {
  const totalMocks = tests.length;

  const prelimsTests = tests.filter((t) => t.stage === 'Prelims');
  const mainsTests = tests.filter((t) => t.stage === 'Mains');

  const avgPrelims = prelimsTests.length
    ? (prelimsTests.reduce((acc, t) => acc + t.totalScore, 0) / prelimsTests.length).toFixed(2)
    : '0.00';

  const avgMains = mainsTests.length
    ? (mainsTests.reduce((acc, t) => acc + t.totalScore, 0) / mainsTests.length).toFixed(2)
    : '0.00';

  const overallAccuracy = tests.length
    ? (tests.reduce((acc, t) => acc + t.accuracy, 0) / tests.length).toFixed(1)
    : '0.0';

  const targetAccuracy = 85.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Mocks Card */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mocks Attempted</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{totalMocks}</h3>
          <p className="text-xs text-blue-500 font-medium mt-1">
            {prelimsTests.length} Prelims | {mainsTests.length} Mains
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
          <ClipboardList size={24} />
        </div>
      </div>

      {/* Average Prelims Score */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Score (Prelims)</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{avgPrelims}</h3>
          <p className="text-xs text-gray-400 mt-1">Out of 125 marks</p>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
          <BarChart3 size={24} />
        </div>
      </div>

      {/* Average Mains Score */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Score (Mains)</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{avgMains}</h3>
          <p className="text-xs text-gray-400 mt-1">Out of 60 marks</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
          <Timer size={24} />
        </div>
      </div>

      {/* Accuracy Tracker Card */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Accuracy</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{overallAccuracy}%</h3>
          <div className="w-28 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(parseFloat(overallAccuracy), 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Target: {targetAccuracy}%</p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Percent size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;