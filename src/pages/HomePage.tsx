import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, History } from 'lucide-react';
import { useTests } from '../contexts/TestContext';

const HomePage: React.FC = () => {
  const { tests } = useTests();
  
  const recentTests = tests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-700 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Your Knowledge with Interactive Tests
            </h1>
            <p className="text-xl mb-8">
              Create, take, and track your tests in one place. Improve your skills with immediate feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/tests" className="btn bg-white text-red-600 hover:bg-gray-100">
                Browse Tests
              </Link>
              <Link to="/create-test" className="btn bg-red-800 text-white hover:bg-red-900">
                Create Your Own Test
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-red-800 opacity-10 pattern-dots"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TestHub</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Tests</h3>
              <p className="text-gray-600">
                Browse through our collection of tests and challenge yourself with various topics and difficulty levels.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Tests</h3>
              <p className="text-gray-600">
                Easily create your own custom tests with multiple question types and share them with others.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <History className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Keep track of your test results and monitor your progress over time to identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tests Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Tests</h2>
            <Link to="/tests" className="text-red-600 hover:text-red-700 font-medium">
              View All Tests
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {recentTests.map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {test.questions.length} questions
                  </span>
                  <Link to={`/tests/${test.id}`} className="btn btn-primary text-sm">
                    Take Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who are improving their skills through our interactive tests.
          </p>
          <Link to="/tests" className="btn bg-white text-red-600 hover:bg-gray-100">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;