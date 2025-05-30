import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useTests } from '../contexts/TestContext';
import TestCard from '../components/TestCard';
import { Test } from '../types';

const TestsPage: React.FC = () => {
  const { tests } = useTests();
  const [filteredTests, setFilteredTests] = useState<Test[]>(tests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Get unique categories
  const categories = ['All', ...new Set(tests.map(test => test.category))];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  useEffect(() => {
    let filtered = [...tests];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        test.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }
    
    // Filter by difficulty
    if (selectedDifficulty && selectedDifficulty !== 'All') {
      filtered = filtered.filter(test => test.difficulty === selectedDifficulty);
    }
    
    setFilteredTests(filtered);
  }, [tests, searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Browse Tests</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tests..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-full md:w-48">
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <select
                className="input"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'All' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Test list */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find tests.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestsPage;