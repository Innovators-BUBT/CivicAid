import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressTracker from '../components/ProgressTracker';

const About = () => {
  const timelineSteps = [
    {
      title: 'Foundation',
      description: 'Started with a vision to make civic engagement accessible to all Bangladeshi citizens',
      year: '2023'
    },
    {
      title: 'Development',
      description: 'Built a comprehensive platform connecting citizens, volunteers, NGOs, and authorities',
      year: '2024'
    },
    {
      title: 'Launch',
      description: 'Successfully launched across all 64 districts of Bangladesh',
      year: '2024'
    },
    {
      title: 'Growth',
      description: 'Expanding services and reaching more communities every day',
      year: 'Present'
    }
  ];

  const teamMembers = [
    {
      name: 'Logno Hassan',
      role: 'Founder & CEO',
      email: 'lognohassan@gmail.com',
      phone: '+880 1798 585 919',
      description: 'Leading the vision to make civic engagement accessible to all Bangladeshi citizens.',
      expertise: 'Project Management, Community Development'
    },
    {
      name: 'Ahmed Rahman',
      role: 'Technical Lead',
      email: 'ahmed.rahman@civicaid.bd',
      phone: '+880 1711 234 567',
      description: 'Overseeing the technical development and ensuring platform reliability.',
      expertise: 'Software Development, System Architecture'
    },
    {
      name: 'Fatima Khan',
      role: 'Community Outreach Manager',
      email: 'fatima.khan@civicaid.bd',
      phone: '+880 1812 345 678',
      description: 'Building partnerships with local communities and NGOs across Bangladesh.',
      expertise: 'Community Relations, Partnership Development'
    },
    {
      name: 'Mohammad Ali',
      role: 'Operations Manager',
      email: 'mohammad.ali@civicaid.bd',
      phone: '+880 1913 456 789',
      description: 'Managing day-to-day operations and ensuring smooth service delivery.',
      expertise: 'Operations Management, Process Optimization'
    },
    {
      name: 'Sadia Islam',
      role: 'User Experience Designer',
      email: 'sadia.islam@civicaid.bd',
      phone: '+880 1614 567 890',
      description: 'Creating intuitive and accessible user experiences for all citizens.',
      expertise: 'UX/UI Design, User Experience'
    },
    {
      name: 'Rashid Ahmed',
      role: 'Data Analyst',
      email: 'rashid.ahmed@civicaid.bd',
      phone: '+880 1515 678 901',
      description: 'Analyzing community needs and optimizing service delivery.',
      expertise: 'Data Analysis, Performance Metrics'
    }
  ];

  const values = [
    {
      title: 'Inclusivity',
      description: 'Making civic engagement available to all Bangladeshi citizens, regardless of location or background.',
      icon: '🌍'
    },
    {
      title: 'Transparency',
      description: 'Providing clear, open communication about all community initiatives and their progress.',
      icon: '🔍'
    },
    {
      title: 'Community First',
      description: 'Putting the needs of local communities at the heart of everything we do.',
      icon: '🤝'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform to better serve the people of Bangladesh.',
      icon: '💡'
    },
    {
      title: 'Free Service',
      description: 'Committed to providing all services completely free for Bangladeshi citizens.',
      icon: '💚'
    },
    {
      title: 'National Coverage',
      description: 'Serving all 64 districts of Bangladesh with equal dedication and quality.',
      icon: '🇧🇩'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            About CivicAid
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to empowering Bangladeshi citizens to actively participate in their communities. 
            <span className="font-semibold text-violet-600"> All our services are completely free for Bangladeshi citizens.</span>
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="card p-8">
            <div className="text-4xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To bridge the gap between citizens and local authorities by providing a free, accessible platform 
              that enables every Bangladeshi to report issues, volunteer for community projects, and actively 
              participate in civic improvement initiatives across all 64 districts.
            </p>
          </div>
          
          <div className="card p-8">
            <div className="text-4xl mb-6">🔮</div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A Bangladesh where every citizen has the power to contribute to their community's development, 
              where civic engagement is effortless and accessible, and where local authorities and citizens 
              work together seamlessly to create better communities for all.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">From vision to nationwide impact</p>
          </div>
          
          <div className="card p-8">
            <ProgressTracker 
              steps={timelineSteps}
              currentStep={3}
              variant="default"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The dedicated professionals behind CivicAid</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card p-6 group hover:scale-105 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-violet-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600">{member.phone}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Expertise:</p>
                    <p className="text-sm text-gray-600">{member.expertise}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="card p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Making a difference across Bangladesh</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">64</div>
              <div className="text-sm text-gray-600">Districts Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-violet-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Free Service</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Be part of the movement to create better communities across Bangladesh. 
              Our services are completely free for all Bangladeshi citizens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started Today
                <svg className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-violet-600 transition-all duration-300 transform hover:scale-105"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

