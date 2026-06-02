import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const MockForm = ({ onTestAdded }) => {
  const [stage, setStage] = useState('Prelims');
  const [title, setTitle] = useState('');
  const [dateTaken, setDateTaken] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [accuracy, setAccuracy] = useState('');

  // Sectional stats
  const [english, setEnglish] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [quantOrGa, setQuantOrGa] = useState('');
  const [professionalKnowledge, setProfessionalKnowledge] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const testPayload = {
      title,
      stage,
      dateTaken,
      totalScore: Number(totalScore),
      timeTaken: Number(timeTaken),
      accuracy: Number(accuracy),
      sections: stage === 'Prelims' ? {
        english: Number(english) || 0,
        reasoning: Number(reasoning) || 0,
        quantOrGa: Number(quantOrGa) || 0,
        professionalKnowledge: 0
      } : {
        english: 0,
        reasoning: 0,
        quantOrGa: 0,
        professionalKnowledge: Number(professionalKnowledge) || 0
      }
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        const newTest = await response.json();
        onTestAdded(newTest);
        // Reset form fields
        setTitle('');
        setDateTaken('');
        setTotalScore('');
        setTimeTaken('');
        setAccuracy('');
        setEnglish('');
        setReasoning('');
        setQuantOrGa('');
        setProfessionalKnowledge('');
      }
    } catch (error) {
      console.error("Error submitting mock result:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <PlusCircle size={20} className="text-blue-500" /> Log Mock Attempt
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle switch for stage selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Stage</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-lg transition-all ${stage === 'Prelims' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setStage('Prelims')}
            >
              Prelims
            </button>
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-lg transition-all ${stage === 'Mains' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setStage('Mains')}
            >
              Mains
            </button>
          </div>
        </div>

        {/* Mock Title & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mock Name / Number</label>
            <input
              type="text"
              required
              placeholder="e.g., Oliveboard Mock 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Taken</label>
            <input
              type="date"
              required
              value={dateTaken}
              onChange={(e) => setDateTaken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Aggregated Score metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Score</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder={stage === 'Prelims' ? "Max 125" : "Max 60"}
              value={totalScore}
              onChange={(e) => setTotalScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Taken (mins)</label>
            <input
              type="number"
              required
              placeholder={stage === 'Prelims' ? "e.g., 120" : "e.g., 45"}
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accuracy (%)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g., 88.5"
              value={accuracy}
              onChange={(e) => setAccuracy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Dynamic Sectional Performance Breakdowns */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Sectional Scores Breakdown</h3>
          
          {stage === 'Prelims' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">English Language</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max 25"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Reasoning Ability</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max 50"
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quant</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max 50"
                  value={quantOrGa}
                  onChange={(e) => setQuantOrGa(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Professional Knowledge</label>
              <input
                type="number"
                step="0.01"
                placeholder="Max 60"
                value={professionalKnowledge}
                onChange={(e) => setProfessionalKnowledge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-xl text-white font-medium shadow-md transition-all ${
            stage === 'Prelims' 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10' 
              : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/10'
          }`}
        >
          {loading ? 'Saving metrics...' : 'Forge Metrics Entry'}
        </button>
      </form>
    </div>
  );
};

export default MockForm;