"use client";

import React, { useState } from 'react';
import { BookOpen, HelpCircle, Menu, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// API configuration
const API_BASE_URL = 'http://localhost:8001';

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'course', label: 'Course Lesson Generator', icon: BookOpen },
    { id: 'mcq', label: 'MCQ Generator', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Creator Studio</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/'}
                className="p-1 rounded-md hover:bg-gray-100 text-blue-600 border border-blue-100"
                title="Go to Home"
              >
                Home
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// Course Lesson Generator Component
const CourseLessonGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    difficulty_level: 'intermediate',
    lesson_duration: '60 minutes',
    include_examples: true,
    include_exercises: true
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateLesson = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-course-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Lesson Generator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., Introduction to Machine Learning"
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Lesson Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Duration
            </label>
            <select
              name="lesson_duration"
              value={formData.lesson_duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="45 minutes">45 minutes</option>
              <option value="60 minutes">60 minutes</option>
              <option value="90 minutes">90 minutes</option>
              <option value="120 minutes">120 minutes</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="include_examples"
                  checked={formData.include_examples}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Include Examples</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="include_exercises"
                  checked={formData.include_exercises}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Include Exercises</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateLesson}
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Generating Lesson...
              </>
            ) : (
              'Generate Course Lesson'
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Generated Lesson</h3>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Topic:</span>
                <p className="text-gray-800">{result.topic}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Difficulty:</span>
                <p className="text-gray-800 capitalize">{result.difficulty_level}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Duration:</span>
                <p className="text-gray-800">{result.estimated_duration}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {result.lesson_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// MCQ Generator Component
const MCQGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    number_of_questions: 5,
    difficulty_level: 'intermediate'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_questions' ? parseInt(value) : value
    }));
  };

  const generateMCQ = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    if (formData.number_of_questions < 1 || formData.number_of_questions > 50) {
      setError('Number of questions must be between 1 and 50');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-mcq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">MCQ Generator</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Topic Input */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript Fundamentals"
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              name="number_of_questions"
              value={formData.number_of_questions}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={generateMCQ}
              disabled={loading}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Generating MCQs...
                </>
              ) : (
                'Generate MCQs'
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* MCQ Results Display */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">Generated MCQs</h3>
            </div>
            <div className="text-sm text-gray-600">
              {result.total_questions} Questions on "{result.topic}"
            </div>
          </div>

          <div className="space-y-6">
            {result.questions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-800">
                    Question {index + 1}: {question.question}
                  </h4>
                </div>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded border ${option === question.correct_answer
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                    >
                      {option}
                      {option === question.correct_answer && (
                        <span className="ml-2 text-xs font-medium text-green-600">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Creator Studio Component
export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState('course');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white rounded-md shadow-md border border-gray-200"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="flex-1 lg:ml-0 p-4 lg:p-8">
          <div className="lg:hidden mb-16" /> {/* Spacer for mobile menu button */}

          {activeTab === 'course' && <CourseLessonGenerator />}
          {activeTab === 'mcq' && <MCQGenerator />}
        </main>
      </div>
    </div>
  );
}