import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestProvider } from './contexts/TestContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TestsPage from './pages/TestsPage';
import TakeTestPage from './pages/TakeTestPage';
import TestResultPage from './pages/TestResultPage';
import CompletedTestsPage from './pages/CompletedTestsPage';
import CreateTestPage from './pages/CreateTestPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <TestProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/tests/:id" element={<TakeTestPage />} />
            <Route path="/results/:id" element={<TestResultPage />} />
            <Route path="/completed-tests" element={<CompletedTestsPage />} />
            <Route path="/create-test" element={<CreateTestPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </TestProvider>
  );
};

export default App;