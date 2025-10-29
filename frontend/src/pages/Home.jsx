import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import DataVisualization from '../components/DataVisualization';
import '../minimalist-modern.css';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const handleSearch = (searchTerm) => {
    setIsLoading(true);
    console.log('Searching for:', searchTerm);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const chartData = {
    labels: ['Road Issues', 'Water Supply', 'Electricity', 'Sanitation', 'Street Lights'],
    datasets: [{
      label: 'Issues Reported',
      data: [45, 32, 28, 19, 15],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderColor: [
        'rgba(139, 92, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)'
      ],
      borderWidth: 2
    }]
  };

  const features = [
    {
      title: 'Report Issues',
      description: 'Easily report civic issues with photos and location tracking',
      icon: 'REPORT',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center',
      color: 'text-icon-primary'
    },
    {
      title: 'Track Progress',
      description: 'Monitor the status of your reported issues in real-time',
      icon: 'TRACK',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center',
      color: 'text-icon-success'
    },
    {
      title: 'Community Engagement',
      description: 'Connect with your community and local authorities',
      icon: 'COMMUNITY',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop&crop=center',
      color: 'text-icon-warning'
    }
  ];

  const services = [
    {
      title: 'Road Maintenance',
      description: 'Report potholes, broken roads, and traffic issues',
      icon: 'ROAD',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&crop=center',
      status: 'Active'
    },
    {
      title: 'Water Supply',
      description: 'Report water leaks, low pressure, and quality issues',
      icon: 'WATER',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
      status: 'Active'
    },
    {
      title: 'Electricity',
      description: 'Report power outages, street light issues, and electrical problems',
      icon: 'POWER',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      status: 'Active'
    },
    {
      title: 'Sanitation',
      description: 'Report garbage collection, drainage, and cleanliness issues',
      icon: 'CLEAN',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      status: 'Active'
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />
      
      {/* Minimalist Hero Section */}
      <section className="section-minimal">
        <div className="container-minimal">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="heading-minimal text-4xl mb-4">
                CivicAid
              </h1>
              <div className="text-icon text-icon-primary mb-6">CIVIC PLATFORM</div>
            </div>
            <p className="subheading-minimal text-xl mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              Empowering Communities Through Smart Civic Engagement
            </p>
            <p className="body-minimal text-base mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              Report, track, and resolve civic issues in your neighborhood. Connect with local authorities and make your community better together.
            </p>
            
            {/* Minimalist Search Bar */}
            <div className="max-w-md mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <EnhancedSearchBar
                placeholder="Search for issues in your area..."
                onSearch={handleSearch}
                suggestions={['Road issues', 'Water problems', 'Electricity', 'Sanitation', 'Street lights']}
                className="shadow-minimal"
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center mb-6 animate-fade-in">
                <div className="loading-minimal">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <span>Searching for issues...</span>
                </div>
              </div>
            )}

            {/* Minimalist CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link to="/submit-complaint" className="minimal-btn minimal-btn-primary">
                <span className="text-icon text-icon-primary">REPORT</span>
              </Link>
              <Link to="/complaints" className="minimal-btn minimal-btn-secondary">
                <span className="text-icon">VIEW</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Stats Section */}
      <section className="section-minimal bg-white">
        <div className="container-minimal">
          <div className="text-center mb-12">
            <h2 className="heading-minimal text-3xl mb-4 animate-fade-in">
              Making a Real Impact
            </h2>
            <p className="body-minimal text-base max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
              Our platform is transforming communities through data-driven civic engagement
            </p>
          </div>
          <div className="grid-minimal grid-4">
            <div className="minimal-card text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-icon text-icon-primary mb-4">STATS</div>
              <div className="heading-minimal text-3xl mb-2">1,247</div>
              <div className="subheading-minimal text-sm mb-2">Issues Reported</div>
              <div className="caption-minimal text-success">+12% this month</div>
            </div>
            <div className="minimal-card text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-icon text-icon-success mb-4">RATE</div>
              <div className="heading-minimal text-3xl mb-2">89%</div>
              <div className="subheading-minimal text-sm mb-2">Resolution Rate</div>
              <div className="caption-minimal text-success">+5% improvement</div>
            </div>
            <div className="minimal-card text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-icon text-icon-warning mb-4">TIME</div>
              <div className="heading-minimal text-3xl mb-2">2.3</div>
              <div className="subheading-minimal text-sm mb-2">Avg. Response Time</div>
              <div className="caption-minimal text-muted">Days</div>
            </div>
            <div className="minimal-card text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="text-icon text-icon-primary mb-4">USERS</div>
              <div className="heading-minimal text-3xl mb-2">5,432</div>
              <div className="subheading-minimal text-sm mb-2">Active Users</div>
              <div className="caption-minimal text-success">+23% growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">Issue Distribution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the most common civic issues in your area and track their resolution progress
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <DataVisualization
              type="chart"
              data={chartData}
              config={{ type: 'bar', height: 300 }}
              className="floating-card p-8"
            />
          </div>
        </div>
      </section>

      {/* Minimalist Features Section */}
      <section className="section-minimal bg-primary-50">
        <div className="container-minimal">
          <div className="text-center mb-12">
            <h2 className="heading-minimal text-3xl mb-4 animate-fade-in">
              Why Choose CivicAid?
            </h2>
            <p className="body-minimal text-base max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
              Our platform provides comprehensive tools to make civic engagement easy, transparent, and effective.
            </p>
          </div>
          
          <div className="grid-minimal grid-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`minimal-card group cursor-pointer ${
                  index === activeFeature ? 'border-accent-300 bg-accent-50' : ''
                } animate-fade-in`}
                style={{animationDelay: `${index * 0.1}s`}}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="relative overflow-hidden rounded-lg mb-6 h-48">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`text-icon ${feature.color}`}>{feature.icon}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="heading-minimal text-lg text-white mb-1">{feature.title}</h3>
                  </div>
                </div>
                <div>
                  <p className="body-minimal text-sm mb-4">{feature.description}</p>
                  <div className="divider"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Services Section */}
      <section className="section-minimal bg-white">
        <div className="container-minimal">
          <div className="text-center mb-12">
            <h2 className="heading-minimal text-3xl mb-4 animate-fade-in">
              Our Services
            </h2>
            <p className="body-minimal text-base max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
              Comprehensive civic services to address all your community needs. From infrastructure to utilities, 
              we've got you covered with smart solutions.
            </p>
          </div>
            
          <div className="grid-minimal grid-4">
            {services.map((service, index) => (
              <div key={index} className="minimal-card text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden rounded-lg mb-4 h-32">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-2 right-2">
                    <span className="text-icon text-icon-primary">{service.icon}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="heading-minimal text-sm text-white">{service.title}</h3>
                  </div>
                </div>
                <p className="body-minimal text-xs mb-4">{service.description}</p>
                <span className="status-badge status-resolved">
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eye-catching CTA Section */}
      <section className="section-minimal bg-gradient-to-r from-primary-800 to-primary-900 text-white py-20">
        <div className="container-minimal text-center">
          <div className="animate-fade-in">
            <h2 className="heading-minimal text-4xl mb-6 text-white font-bold">
              Ready to Make a Difference?
            </h2>
          </div>
          <p className="body-minimal text-lg mb-10 max-w-3xl mx-auto text-gray-200 animate-fade-in leading-relaxed" style={{animationDelay: '0.1s'}}>
            Join thousands of citizens actively improving their communities. 
            Be part of the change you want to see.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Link to="/register" className="minimal-btn minimal-btn-accent text-lg px-8 py-4">
              <span className="text-icon text-icon-primary">START</span>
            </Link>
            <Link to="/about" className="minimal-btn minimal-btn-ghost text-white border-2 border-white hover:bg-white hover:text-primary-900 text-lg px-8 py-4">
              <span className="text-icon">LEARN</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="bg-primary-900 text-white py-16">
        <div className="container-minimal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent-600 rounded flex items-center justify-center">
                </div>
                <h3 className="heading-minimal text-xl text-white">CivicAid</h3>
              </div>
              <p className="body-minimal text-base text-gray-300 mb-6 leading-relaxed">
                Smart civic engagement platform connecting citizens with local authorities for transparent issue resolution.
              </p>
              <div className="flex space-x-3">
                <a href="https://facebook.com" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="https://twitter.com" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="https://linkedin.com" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
                <a href="https://instagram.com" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                  <span className="text-sm font-bold">ig</span>
                </a>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h4 className="heading-minimal text-lg mb-6 text-white">Quick Access</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="body-minimal text-base text-gray-300 hover:text-accent-400 transition-colors">
                  About
                </Link></li>
                <li><Link to="/services" className="body-minimal text-base text-gray-300 hover:text-accent-400 transition-colors">
                  Services
                </Link></li>
                <li><Link to="/contact" className="body-minimal text-base text-gray-300 hover:text-accent-400 transition-colors">
                  Contact
                </Link></li>
              </ul>
            </div>
            
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h4 className="heading-minimal text-lg mb-6 text-white">Stay Connected</h4>
              <p className="body-minimal text-base text-gray-300 mb-6">
                Get updates on community improvements and civic news.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-base text-white placeholder-gray-400 focus:outline-none focus:border-accent-500"
                />
                <button className="px-6 py-3 bg-accent-600 text-white rounded-r-lg text-base font-medium hover:bg-accent-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="body-minimal text-gray-400">
              © 2024 CivicAid. Building better communities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 