import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MockForm from './components/MockForm';
import TestHistory from './components/TestHistory';
import PerformanceCharts from './components/PerformanceCharts';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import { Shield, LayoutDashboard, BarChart3, Database, Sun, Moon, Menu, X } from 'lucide-react';

function App() {
  const [tests, setTests] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('console'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile drawer toggle switch

  // Sync stateful themes with structural HTML DOM boundaries
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Read initialized historical tests from remote database
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tests`);
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error("Failed to query API engine logs:", error);
      }
    };
    fetchTests();
  }, []);

  const handleTestAdded = (newTest) => {
    setTests([newTest, ...tests]);
  };

  const handleDeleteTest = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tests/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTests(tests.filter((test) => test._id !== id));
      }
    } catch (error) {
      console.error("Failed to eliminate log entry:", error);
    }
  };

  // Helper utility to switch views securely across distinct viewports
  const navigateToTab = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Requirement: Auto-close on menu item selection
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200 flex relative overflow-x-hidden">
      
      {/* 1. MOBILE MENU BACKGROUND OVERLAY BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} // Requirement: Close drawer clicking outside
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. RESPONSIVE MOBILE NAVIGATION DRAWER SIDEBAR */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-darkCard border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
                <Shield size={20} />
              </div>
              <div>
                <h1 className="font-extrabold text-md tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">ScoreForge</h1>
                <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">IBPS SO Engine</p>
              </div>
            </div>
            {/* Requirement: Close via (X) Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => navigateToTab('console')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'console'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard size={18} />
              Console Workspace
            </button>
            
            <button 
              onClick={() => navigateToTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 size={18} />
              Mock Analysis
            </button>
          </nav>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Database size={16} className="text-emerald-500 animate-pulse" />
          <div className="text-[11px]">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Live Server Connected</p>
            <p className="text-gray-400">Port 5000 Active</p>
          </div>
        </div>
      </aside>

      {/* 3. ORIGINAL DESKTOP SIDEBAR LAYOUT (UNCHANGED BEHAVIOR) */}
      <aside className="w-64 bg-white dark:bg-darkCard border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">ScoreForge</h1>
              <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">IBPS SO Engine</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'console'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard size={18} />
              Console Workspace
            </button>
            
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 size={18} />
              Mock Analysis
            </button>
          </nav>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Database size={18} className="text-emerald-500 animate-pulse" />
          <div className="text-xs">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Live Server Connected</p>
            <p className="text-gray-400">Port 5000 Active</p>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace Panel */}
      <main className="flex-1 max-h-screen overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* Nav Header Bar Controls */}
        <header className="flex justify-between items-center bg-white dark:bg-darkCard px-4 md:px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm gap-2">
          
          {/* LEFT HEADER AREA: Hamburger and Title texts */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Requirement: Visible hamburger icon on mobile views (< 768px) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all md:hidden shrink-0"
            >
              <Menu size={18} />
            </button>
            
            <div className="min-w-0">
              <h2 className="text-base md:text-xl font-bold text-gray-800 dark:text-white truncate">
                {activeTab === 'console' ? 'Mock Test Insights Tracker' : 'Comprehensive Data Metrics Core'}
              </h2>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">Refining quantitative and professional technical expertise</p>
            </div>
          </div>

          {/* RIGHT HEADER AREA: Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shrink-0"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Dynamic Workspace Screen Rendering based on selected tab state */}
        {activeTab === 'console' ? (
          <>
            {/* Global Dashboard KPI Cards Widget */}
            <Dashboard tests={tests} />

            {/* Input Form Matrix layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <MockForm onTestAdded={handleTestAdded} />
              </div>
              <div className="lg:col-span-2">
                <TestHistory tests={tests} onDeleteTest={handleDeleteTest} />
              </div>
            </div>

            {/* Recharts Graphical Trends Panel */}
            <PerformanceCharts tests={tests} />
          </>
        ) : (
          <PerformanceAnalytics tests={tests} />
        )}
      </main>
    </div>
  );
}

export default App;