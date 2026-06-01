import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const PerformanceCharts = ({ tests }) => {
  // Filter and format trend analytics data
  const chronologicallySortedTests = [...tests].reverse();

  const prelimsData = chronologicallySortedTests
    .filter((t) => t.stage === 'Prelims')
    .map((t, index) => ({
      name: t.title.substring(0, 10) || `P-${index + 1}`,
      Score: t.title,
      'Total Score': t.totalScore,
      'Accuracy (%)': t.accuracy,
      'English': t.sections?.english || 0,
      'Reasoning': t.sections?.reasoning || 0,
      'Quant/GA': t.sections?.quantOrGa || 0,
    }));

  const mainsData = chronologicallySortedTests
    .filter((t) => t.stage === 'Mains')
    .map((t, index) => ({
      name: t.title.substring(0, 10) || `M-${index + 1}`,
      Score: t.title,
      'Total Score': t.totalScore,
      'Accuracy (%)': t.accuracy,
      'Professional Knowledge': t.sections?.professionalKnowledge || 0,
    }));

  return (
    <div className="space-y-8">
      {/* Prelims Performance Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Prelims: Score Timeline Trends</h3>
          <div className="h-64">
            {prelimsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prelimsData}>
                  <defs>
                    <linearGradient id="prelimsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="Total Score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#prelimsColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Log prelims mocks to render trend curves.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Prelims: Section-Wise Metrics Breakdown</h3>
          <div className="h-64">
            {prelimsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prelimsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="English" stackId="a" fill="#60a5fa" />
                  <Bar dataKey="Reasoning" stackId="a" fill="#34d399" />
                  <Bar dataKey="Quant/GA" stackId="a" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Log prelims mocks to view sectional distribution maps.</div>
            )}
          </div>
        </div>
      </div>

      {/* Mains Performance Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Mains: Score Timeline Trends</h3>
          <div className="h-64">
            {mainsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mainsData}>
                  <defs>
                    <linearGradient id="mainsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="Total Score" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#mainsColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Log mains mocks to render trend curves.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Professional Knowledge Mastery</h3>
          <div className="h-64">
            {mainsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mainsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="Professional Knowledge" fill="#c084fc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Log mains metrics to evaluate domain mastery.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;