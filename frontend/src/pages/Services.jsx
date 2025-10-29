import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: '📝',
      title: 'Complaint Submission',
      description: 'Submit complaints about public services, infrastructure issues, and community problems',
      features: [
        'Free for all Bangladeshi citizens',
        'Photo evidence upload',
        'Multilingual support (English & বাংলা)',
        'Real-time status tracking'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🏛️',
      title: 'Government Collaboration',
      description: 'Direct connection with local government departments and authorities',
      features: [
        'Municipal corporation integration',
        'Department-wise complaint routing',
        'Official response tracking',
        'Government accountability'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '👥',
      title: 'Community Engagement',
      description: 'Connect with fellow citizens and community organizations',
      features: [
        'Area-based complaint visibility',
        'Community problem identification',
        'Volunteer coordination',
        'NGO partnership opportunities'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📊',
      title: 'Transparency & Reporting',
      description: 'Open access to complaint data and resolution progress',
      features: [
        'Public complaint statistics',
        'Resolution time tracking',
        'Department performance metrics',
        'Community impact reports'
      ],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const categories = [
    {
      icon: '🛣️',
      title: 'Road & Infrastructure',
      description: 'Report road damage, potholes, street lighting, and construction issues',
      examples: ['Broken roads', 'Street light problems', 'Drainage issues', 'Construction delays'],
      color: 'blue'
    },
    {
      icon: '💧',
      title: 'Water & Sanitation',
      description: 'Report water supply problems, sanitation issues, and waste management',
      examples: ['Water shortage', 'Sewage problems', 'Garbage collection', 'Drainage blockages'],
      color: 'cyan'
    },
    {
      icon: '⚡',
      title: 'Utilities & Services',
      description: 'Report electricity, gas, and other utility service issues',
      examples: ['Power outages', 'Gas leaks', 'Internet problems', 'Phone connectivity'],
      color: 'yellow'
    },
    {
      icon: '🏥',
      title: 'Healthcare & Safety',
      description: 'Report healthcare facility issues and public safety concerns',
      examples: ['Hospital problems', 'Medical emergencies', 'Safety hazards', 'Security issues'],
      color: 'red'
    },
    {
      icon: '🌱',
      title: 'Environment & Pollution',
      description: 'Report environmental issues and pollution problems',
      examples: ['Air pollution', 'Water pollution', 'Noise pollution', 'Deforestation'],
      color: 'green'
    },
    {
      icon: '🏫',
      title: 'Education & Public Services',
      description: 'Report issues with schools, government offices, and public facilities',
      examples: ['School problems', 'Government services', 'Public transport', 'Postal services'],
      color: 'purple'
    }
  ];

  const areas = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
    'Dhaka North', 'Dhaka South', 'Narayanganj', 'Gazipur', 'Tangail', 'Narsingdi',
    'Comilla', 'Noakhali', 'Feni', 'Lakshmipur', 'Chandpur', 'Brahmanbaria'
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg animate-bounce">
              <span className="mr-2">🇧🇩</span>
              Government of Bangladesh Initiative
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Free Public Services for All{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Bangladeshi Citizens
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              CivicAid is a government-supported platform providing free complaint management 
              and community service coordination across all 64 districts of Bangladesh.
            </p>
          </div>
          
          {/* Enhanced Free Service Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 max-w-3xl mx-auto mb-10 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">100% Free Service</h3>
                <p className="text-green-700 text-lg">No hidden costs, no subscriptions</p>
              </div>
            </div>
            <p className="text-green-700 text-center text-lg">
              This is a public service funded by the Government of Bangladesh. 
              Every feature is completely free for all citizens.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="flex items-center justify-center">
                Get Started - Free Registration
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className="group border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl text-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center justify-center">
                Learn More About CivicAid
                <svg className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Core Services */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              🚀 Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to serve every citizen of Bangladesh
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{service.description}</p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-green-600 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              📋 Service Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Can You Report?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From infrastructure issues to environmental concerns, report any community problem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-r from-${category.color}-400 to-${category.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 text-base mb-6 leading-relaxed">{category.description}</p>
                
                <div className="space-y-2">
                  {category.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      <div className={`w-2 h-2 bg-${category.color}-400 rounded-full mr-3 flex-shrink-0`}></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              🗺️ Coverage Areas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Service Coverage Across Bangladesh
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Available to citizens in all administrative divisions and districts
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🗺️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Available in All 64 Districts
              </h3>
              <p className="text-gray-600 text-lg">
                CivicAid serves citizens across all administrative divisions of Bangladesh
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {areas.map((area, index) => (
                <div key={index} className="group text-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md hover:shadow-lg">
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-800 transition-colors flex items-center justify-center">
                    <span className="mr-1">📍</span>
                    {area}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-500 text-lg">
                And many more cities, towns, and villages across Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
              ⚡ How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How CivicAid Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to get your community issues resolved
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1️⃣', title: 'Register', desc: 'Create your free account with basic information', color: 'blue' },
              { step: '2️⃣', title: 'Submit', desc: 'Report issues with photos and detailed descriptions', color: 'green' },
              { step: '3️⃣', title: 'Track', desc: 'Monitor progress and receive updates on your complaint', color: 'yellow' },
              { step: '4️⃣', title: 'Resolve', desc: 'See your community issues resolved by authorities', color: 'purple' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Government Support */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 shadow-2xl border border-blue-100">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="text-6xl">🏛️</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Government of Bangladesh Supported
              </h2>
              <p className="text-xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
                CivicAid operates under the direct supervision of the Ministry of Local Government, 
                Rural Development and Co-operatives, ensuring official recognition and support 
                for all citizen complaints.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { icon: '📋', title: 'Official Recognition', desc: 'All complaints are officially recorded and tracked' },
                  { icon: '🔗', title: 'Direct Integration', desc: 'Connected with government departments' },
                  { icon: '📊', title: 'Accountability', desc: 'Government performance monitoring' }
                ].map((item, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of Bangladeshi citizens who are already using CivicAid 
              to improve their communities. Your voice matters, and together we can 
              build a better Bangladesh.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-5 rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  Start Your Free Account Now
                  <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="group border-2 border-green-600 text-green-600 px-12 py-5 rounded-xl text-xl font-bold hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center">
                  Contact Support Team
                  <svg className="ml-2 w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <p className="text-lg text-blue-800 font-semibold">
                🌟 Need help? Our support team is available 24/7 in both English and বাংলা
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-600">
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              CivicAid - Empowering Citizens, Strengthening Communities, Building Bangladesh 🇧🇩
            </h3>
            <p className="text-lg text-gray-700">
              A free public service initiative by the Government of Bangladesh
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Services;




