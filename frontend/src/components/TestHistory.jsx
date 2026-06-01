import React from 'react';
import { Trash2, Calendar, Award, Hourglass } from 'lucide-react';

const TestHistory = ({ tests, onDeleteTest }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Logged Performance History</h3>
      </div>
      <div className="overflow-x-auto">
        {tests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Mock Test Details</th>
                <th className="px-6 py-3">Stage</th>
                <th className="px-6 py-3">Marks Secured</th>
                <th className="px-6 py-3">Time Spent</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {tests.map((test) => (
                <tr key={test._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{test.title}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {formatDate(test.dateTaken)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      test.stage === 'Prelims' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                    }`}>
                      {test.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-mono font-medium text-gray-900 dark:text-white">
                      <Award size={14} className="text-amber-500" />
                      {test.totalScore}
                      <span className="text-xs text-gray-400">
                        /{test.stage === 'Prelims' ? '125' : '60'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Hourglass size={14} /> {test.timeTaken} mins
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {test.accuracy}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDeleteTest(test._id)}
                      className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            No mock records discovered. Complete the metrics engine configuration above to visualize logs here.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;