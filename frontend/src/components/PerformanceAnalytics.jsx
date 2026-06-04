import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Edit3, Check, X } from 'lucide-react';

const PerformanceAnalytics = ({ tests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sortField, setSortField] = useState('dateTaken');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // INITIALIZE STATE DIRECTLY FROM LOCALSTORAGE SO IT PERSISTS ON REFRESH
  const [customRecords, setCustomRecords] = useState(() => {
    const savedData = localStorage.getItem('mock_performance_records');
    return savedData ? JSON.parse(savedData) : {};
  });
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // SAVE TO LOCALSTORAGE AUTOMATICALLY WHENEVER STATE CHANGES
  useEffect(() => {
    localStorage.setItem('mock_performance_records', JSON.stringify(customRecords));
  }, [customRecords]);

  const startEditing = (test) => {
    setEditingId(test._id);
    const saved = customRecords[test._id] || {};
    
    setEditForm({
      attempts: saved.attempts ?? test.attempts ?? (test.stage === 'Prelims' ? 83 : 45),
      correct: saved.correct ?? test.correct ?? (test.stage === 'Prelims' ? 64 : 38),
      wrong: saved.wrong ?? test.wrong ?? (test.stage === 'Prelims' ? 19 : 7),
      unattempted: saved.unattempted ?? test.unattempted ?? (test.stage === 'Prelims' ? 67 : 15),
      
      sec1_score: saved.sections?.sec1_score ?? test.sections?.english ?? parseFloat((test.totalScore * 0.25).toFixed(2)),
      sec1_att: saved.sections?.sec1_att ?? 25,
      sec1_cor: saved.sections?.sec1_cor ?? 20,
      sec1_wrg: saved.sections?.sec1_wrg ?? 5,
      sec1_una: saved.sections?.sec1_una ?? 25,

      sec2_score: saved.sections?.sec2_score ?? test.sections?.reasoning ?? parseFloat((test.totalScore * 0.40).toFixed(2)),
      sec2_att: saved.sections?.sec2_att ?? 30,
      sec2_cor: saved.sections?.sec2_cor ?? 24,
      sec2_wrg: saved.sections?.sec2_wrg ?? 6,
      sec2_una: saved.sections?.sec2_una ?? 20,

      sec3_score: saved.sections?.sec3_score ?? test.sections?.quantOrGa ?? parseFloat((test.totalScore * 0.35).toFixed(2)),
      sec3_att: saved.sections?.sec3_att ?? 28,
      sec3_cor: saved.sections?.sec3_cor ?? 20,
      sec3_wrg: saved.sections?.sec3_wrg ?? 8,
      sec3_una: saved.sections?.sec3_una ?? 22,
    });
  };

  const saveFormMetrics = (id) => {
    const att = Number(editForm.attempts);
    const cor = Number(editForm.correct);
    const wrg = Number(editForm.wrong);
    const una = Number(editForm.unattempted);

    if (att !== cor + wrg) {
      alert(`Validation Warning: Total attempts (${att}) must match Correct (${cor}) + Wrong (${wrg}).`);
      return;
    }

    setCustomRecords(prev => ({
      ...prev,
      [id]: {
        attempts: att,
        correct: cor,
        wrong: wrg,
        unattempted: una,
        sections: {
          sec1_score: Number(editForm.sec1_score), sec1_att: Number(editForm.sec1_att), sec1_cor: Number(editForm.sec1_cor), sec1_wrg: Number(editForm.sec1_wrg), sec1_una: Number(editForm.sec1_una),
          sec2_score: Number(editForm.sec2_score), sec2_att: Number(editForm.sec2_att), sec2_cor: Number(editForm.sec2_cor), sec2_wrg: Number(editForm.sec2_wrg), sec2_una: Number(editForm.sec2_una),
          sec3_score: Number(editForm.sec3_score), sec3_att: Number(editForm.sec3_att), sec3_cor: Number(editForm.sec3_cor), sec3_wrg: Number(editForm.sec3_wrg), sec3_una: Number(editForm.sec3_una),
        }
      }
    }));
    setEditingId(null);
  };

const processedTestsWithMetrics = useMemo(() => {
    return tests.map((test, index) => {
      const maxMarks = test.stage === 'Prelims' ? 125 : 60;
      const totalQuestions = test.stage === 'Prelims' ? 150 : 60;

      const saved = customRecords[test._id] || {};
      const seedOffset = index * 4; 

      // 1. Resolve Parent Level Totals
      const attempts = saved.attempts ?? test.attempts ?? (test.stage === 'Prelims' ? 85 - seedOffset : 45);
      const correct = saved.correct ?? test.correct ?? (test.stage === 'Prelims' ? 68 - seedOffset : 38);
      const wrong = saved.wrong ?? test.wrong ?? Math.max(0, attempts - correct);
      const unattempted = Math.max(0, totalQuestions - attempts); // Strict calculation
      const accuracy = attempts > 0 ? parseFloat(((correct / attempts) * 100).toFixed(1)) : test.accuracy;

      let sectionalBreakdown = [];
      if (test.stage === 'Prelims') {
        if (saved.sections) {
          const s = saved.sections;
          
          // Section Max Questions definitions for Prelims: 50 + 50 + 50 = 150 total questions
          const sec1MaxQs = 50; 
          const sec2MaxQs = 50;
          const sec3MaxQs = 50;

          sectionalBreakdown = [
            { 
              name: 'English Language', 
              score: s.sec1_score, 
              max: 25, 
              attempts: s.sec1_att, 
              correct: s.sec1_cor, 
              wrong: s.sec1_wrg, 
              unattempted: Math.max(0, sec1MaxQs - s.sec1_att), // Calculated dynamically
              acc: s.sec1_att > 0 ? parseFloat(((s.sec1_cor / s.sec1_att) * 100).toFixed(1)) : 0 
            },
            { 
              name: 'Reasoning Ability', 
              score: s.sec2_score, 
              max: 50, 
              attempts: s.sec2_att, 
              correct: s.sec2_cor, 
              wrong: s.sec2_wrg, 
              unattempted: Math.max(0, sec2MaxQs - s.sec2_att), // Calculated dynamically
              acc: s.sec2_att > 0 ? parseFloat(((s.sec2_cor / s.sec2_att) * 100).toFixed(1)) : 0 
            },
            { 
              name: 'Quantitative Aptitude / GA', 
              score: s.sec3_score, 
              max: 50, 
              attempts: s.sec3_att, 
              correct: s.sec3_cor, 
              wrong: s.sec3_wrg, 
              unattempted: Math.max(0, sec3MaxQs - s.sec3_att), // Calculated dynamically
              acc: s.sec3_att > 0 ? parseFloat(((s.sec3_cor / s.sec3_att) * 100).toFixed(1)) : 0 
            }
          ];
        } else {
          // Clean decoupled fallbacks when no custom records exist yet
          const s1_att = 24 - index;
          const s2_att = 35 + index;
          const s3_att = Math.max(0, attempts - (s1_att + s2_att));

          sectionalBreakdown = [
            { name: 'English Language', score: test.sections?.english || parseFloat((test.totalScore * 0.22).toFixed(2)), max: 25, attempts: s1_att, correct: 18 - index, wrong: Math.max(0, s1_att - (18 - index)), unattempted: Math.max(0, 50 - s1_att), acc: '75.0' },
            { name: 'Reasoning Ability', score: test.sections?.reasoning || parseFloat((test.totalScore * 0.43).toFixed(2)), max: 50, attempts: s2_att, correct: 28 + index, wrong: Math.max(0, s2_att - (28 + index)), unattempted: Math.max(0, 50 - s2_att), acc: '80.0' },
            { name: 'Quantitative Aptitude / GA', score: test.sections?.quantOrGa || parseFloat((test.totalScore * 0.35).toFixed(2)), max: 50, attempts: s3_att, correct: Math.max(0, correct - ((18 - index) + (28 + index))), wrong: Math.max(0, s3_att - Math.max(0, correct - ((18 - index) + (28 + index)))), unattempted: Math.max(0, 50 - s3_att), acc: '73.5' }
          ];
        }
      } else {
        sectionalBreakdown = [
          { name: 'Professional Knowledge', score: test.totalScore, max: 60, attempts, correct, wrong, unattempted, acc: accuracy }
        ];
      }

      return {
        ...test,
        maxMarks,
        totalQuestions,
        computedAttempts: attempts,
        computedCorrect: correct,
        computedWrong: wrong,
        computedUnattempted: unattempted,
        computedAccuracy: accuracy,
        resolvedSections: sectionalBreakdown
      };
    });
  }, [tests, customRecords]);

  const globalSummaryMetrics = useMemo(() => {
    const total = processedTestsWithMetrics.length;
    if (total === 0) return { totalMocks: 0, avgScore: 0, avgAccuracy: 0, totalAttempts: 0, totalCorrect: 0, totalWrong: 0, totalUnattempted: 0 };

    let scoreSum = 0, accuracySum = 0, attemptsSum = 0, correctSum = 0, wrongSum = 0, unattemptedSum = 0;

    processedTestsWithMetrics.forEach((t) => {
      scoreSum += t.totalScore;
      accuracySum += t.computedAccuracy;
      attemptsSum += t.computedAttempts;
      correctSum += t.computedCorrect;
      wrongSum += t.computedWrong;
      unattemptedSum += t.computedUnattempted;
    });

    return {
      totalMocks: total,
      avgScore: (scoreSum / total).toFixed(2),
      avgAccuracy: (accuracySum / total).toFixed(1),
      totalAttempts: attemptsSum,
      totalCorrect: correctSum,
      totalWrong: wrongSum,
      totalUnattempted: unattemptedSum
    };
  }, [processedTestsWithMetrics]);

  const filteredAndSortedTests = useMemo(() => {
    return processedTestsWithMetrics
      .filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = stageFilter === 'All' || t.stage === stageFilter;
        return matchesSearch && matchesStage;
      })
      .sort((a, b) => {
        if (sortField === 'dateTaken') {
          return sortDirection === 'asc' ? new Date(a.dateTaken) - new Date(b.dateTaken) : new Date(b.dateTaken) - new Date(a.dateTaken);
        }
        return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
      });
  }, [processedTestsWithMetrics, searchTerm, stageFilter, sortField, sortDirection]);

  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTests, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTests.length / itemsPerPage) || 1;

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mock Records</p>
          <p className="text-2xl font-bold mt-1 text-white">{globalSummaryMetrics.totalMocks}</p>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Cumulative Score</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">{globalSummaryMetrics.avgScore}</p>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Accuracy Matrix</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{globalSummaryMetrics.avgAccuracy}%</p>
        </div>     
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
            <input 
              type="text"
              placeholder="Search historical records..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-700 bg-transparent rounded-xl text-white focus:outline-none"
            />
          </div>
          <div className="flex gap-1 bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
            {['All', 'Prelims', 'Mains'].map((stage) => (
              <button
                key={stage}
                onClick={() => { setStageFilter(stage); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  stageFilter === stage ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('title')}>Mock Name</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('dateTaken')}>Date</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('totalScore')}>Score</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-center">A / C / W / U</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {paginatedTests.length > 0 ? (
                paginatedTests.map((test) => {
                  const isExpanded = !!expandedRows[test._id];
                  const isEditing = editingId === test._id;

                  return (
                    <React.Fragment key={test._id}>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 font-semibold text-white">{test.title}</td>
                        <td className="px-4 py-4 text-slate-500 whitespace-nowrap">{new Date(test.dateTaken).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 font-medium rounded-full text-[10px] ${
                            test.stage === 'Prelims' ? 'bg-blue-950/40 text-blue-400' : 'bg-purple-950/40 text-purple-400'
                          }`}>{test.stage}</span>
                        </td>
                        <td className="px-4 py-4 font-mono font-bold text-white">
                          {test.totalScore}<span className="text-slate-500 font-normal text-[10px]">/{test.stage === 'Prelims' ? '125' : '60'}</span>
                        </td>
                        <td className="px-4 py-4 text-emerald-400 font-bold">{test.computedAccuracy}%</td>
                        <td className="px-4 py-4 text-slate-500">{test.timeTaken}m</td>
                        <td className="px-4 py-4 text-center font-mono text-[11px] whitespace-nowrap">
                          <span className="text-white font-bold">{test.computedAttempts}</span><span className="text-slate-700 mx-1">/</span>
                          <span className="text-emerald-400 font-bold">{test.computedCorrect}</span><span className="text-slate-700 mx-1">/</span>
                          <span className="text-rose-400 font-bold">{test.computedWrong}</span><span className="text-slate-700 mx-1">/</span>
                          <span className="text-amber-400">{test.computedUnattempted}</span>
                        </td>
                        <td className="px-4 py-4 text-right space-x-3 whitespace-nowrap">
                          <button 
                            onClick={() => isEditing ? saveFormMetrics(test._id) : startEditing(test)}
                            className="text-slate-400 hover:text-blue-400 p-1"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            onClick={() => toggleRow(test._id)}
                            className="text-blue-400 hover:underline font-medium"
                          >
                            {isExpanded ? 'Hide' : 'Breakdown'}
                          </button>
                        </td>
                      </tr>

                      {isEditing && (
                        <tr>
                          <td colSpan="8" className="p-4 bg-slate-900/90 border-l-4 border-blue-500 space-y-4">
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                              <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2">Configure Global Mock Parameters</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-1">Total Attempts</label>
                                  <input type="number" value={editForm.attempts} onChange={e => setEditForm({...editForm, attempts: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-emerald-400 mb-1">Correct Items</label>
                                  <input type="number" value={editForm.correct} onChange={e => setEditForm({...editForm, correct: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-rose-400 mb-1">Wrong Items</label>
                                  <input type="number" value={editForm.wrong} onChange={e => setEditForm({...editForm, wrong: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white" />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-amber-400 mb-1">Unattempted Questions</label>
                                  <input type="number" value={editForm.unattempted} onChange={e => setEditForm({...editForm, unattempted: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white" />
                                </div>
                              </div>
                            </div>

                            {test.stage === 'Prelims' && (
                              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-3">
                                <h4 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Configure Section-Wise Manual Parameters</h4>
                                
                                <div className="border-b border-slate-800/60 pb-2 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                                  <span className="text-[11px] font-semibold text-white block sm:mb-1.5">English Language:</span>
                                  <input type="number" step="0.25" placeholder="Score" value={editForm.sec1_score} onChange={e => setEditForm({...editForm, sec1_score: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Att" value={editForm.sec1_att} onChange={e => setEditForm({...editForm, sec1_att: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Cor" value={editForm.sec1_cor} onChange={e => setEditForm({...editForm, sec1_cor: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Wrg" value={editForm.sec1_wrg} onChange={e => setEditForm({...editForm, sec1_wrg: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                </div>

                                <div className="border-b border-slate-800/60 pb-2 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                                  <span className="text-[11px] font-semibold text-white block sm:mb-1.5">Reasoning Ability:</span>
                                  <input type="number" step="0.25" placeholder="Score" value={editForm.sec2_score} onChange={e => setEditForm({...editForm, sec2_score: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Att" value={editForm.sec2_att} onChange={e => setEditForm({...editForm, sec2_att: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Cor" value={editForm.sec2_cor} onChange={e => setEditForm({...editForm, sec2_cor: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Wrg" value={editForm.sec2_wrg} onChange={e => setEditForm({...editForm, sec2_wrg: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                                  <span className="text-[11px] font-semibold text-white block sm:mb-1.5">Quantitative / GA:</span>
                                  <input type="number" step="0.25" placeholder="Score" value={editForm.sec3_score} onChange={e => setEditForm({...editForm, sec3_score: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Att" value={editForm.sec3_att} onChange={e => setEditForm({...editForm, sec3_att: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Cor" value={editForm.sec3_cor} onChange={e => setEditForm({...editForm, sec3_cor: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                  <input type="number" placeholder="Wrg" value={editForm.sec3_wrg} onChange={e => setEditForm({...editForm, sec3_wrg: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-1 text-[11px]" />
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 text-[11px]">
                              <button onClick={() => setEditingId(null)} className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">Cancel</button>
                              <button onClick={() => saveFormMetrics(test._id)} className="px-3 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700">Save Mock Adjustments</button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {isExpanded && (
                        <tr>
                          <td colSpan="8" className="p-4 bg-slate-950/40 border-t border-b border-slate-800">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-800/40">
                                    <th className="p-3">Section Name</th>
                                    <th className="p-3">Obtained Score</th>
                                    <th className="p-3 text-center">Attempts</th>
                                    <th className="p-3 text-center text-emerald-400">Correct</th>
                                    <th className="p-3 text-center text-rose-400">Wrong</th>
                                    <th className="p-3 text-center text-amber-400">Unattempted</th>
                                    <th className="p-3 text-right">Accuracy %</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                                  {test.resolvedSections.map((sec, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/20">
                                      <td className="p-3 font-sans font-semibold text-white">{sec.name}</td>
                                      <td className="p-3 font-bold text-white">{sec.score}<span className="text-slate-500 font-normal text-[10px]">/{sec.max}</span></td>
                                      <td className="p-3 text-center">{sec.attempts}</td>
                                      <td className="p-3 text-center text-emerald-400 font-semibold">{sec.correct}</td>
                                      <td className="p-3 text-center text-rose-400 font-semibold">{sec.wrong}</td>
                                      <td className="p-3 text-center text-amber-400">{sec.unattempted}</td>
                                      <td className="p-3 text-right text-emerald-400 font-bold">{sec.acc}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">No mock records tracked inside search queries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span></div>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-40 font-medium">Previous</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-40 font-medium">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;