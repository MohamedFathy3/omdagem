// app/support/page.tsx
import React from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaTools, 
  FaUsers, 
  FaWrench,
  FaClock,
  FaQuestionCircle,
  FaFileAlt,
  FaVideo
} from 'react-icons/fa';
import Link from 'next/link';
import '@/styles/globals.css'
import ProtectedRoute from '@/components/ProtectedRoute';

const SupportPage = () => {
  const supportCategories = [
    {
      icon: <FaWrench className="w-8 h-8" />,
      title: "Technical Support",
      description: "Get help with machine operation, programming, and technical issues",
      contact: "tech.support@cncworldmachining.com",
      responseTime: "Response within 2 hours"
    },
    {
      icon: <FaTools className="w-8 h-8" />,
      title: "Maintenance Service",
      description: "Scheduled maintenance, repairs, and spare parts support",
      contact: "maintenance@cncworldmachining.com",
      responseTime: "24/7 emergency support"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Engineering Consultation",
      description: "Expert advice from our experienced engineers",
      contact: "engineering@cncworldmachining.com",
      responseTime: "Response within 24 hours"
    }
  ];

  const faqs = [
    {
      question: "How do I schedule maintenance for my CNC machine?",
      answer: "You can schedule maintenance by contacting our maintenance team at maintenance@cncworldmachining.com or calling our emergency support line."
    },
    {
      question: "What are your response times for technical support?",
      answer: "Our technical support team responds within 2 hours during business hours. Emergency support is available 24/7."
    },
    {
      question: "Do you offer on-site engineering consultation?",
      answer: "Yes, we provide on-site consultation services. Contact our engineering team to schedule a visit."
    },
    {
      question: "How can I access machine documentation and manuals?",
      answer: "All documentation is available in our online portal after registration. Contact support for access credentials."
    }
  ];

  const resources = [
    {
      icon: <FaFileAlt className="w-6 h-6" />,
      title: "Technical Documentation",
      description: "Manuals, guides, and technical specs"
    },
    {
      icon: <FaVideo className="w-6 h-6" />,
      title: "Video Tutorials",
      description: "Step-by-step operation guides"
    },
    {
      icon: <FaQuestionCircle className="w-6 h-6" />,
      title: "Knowledge Base",
      description: "Common issues and solutions"
    }
  ];

  return (
        <ProtectedRoute allowedRoles={['admin']}>

    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">CNC World Machining Support</h1>
            <p className="text-2xl mb-8 text-blue-100">Expert Support for Your Machining Needs</p>
            <p className="text-lg text-blue-100 mb-12">
              Were here to help with technical support, maintenance, and engineering consultation
            </p>
            
            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+201149040303" 
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <FaPhone /> Emergency Support: +20 11 49040303
              </a>
              <a 
                href="mailto:cncworldmachining@gmail.com" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition flex items-center gap-2"
              >
                <FaEnvelope /> cncworldmachining@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-blue-900 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-2">24/7 Emergency Line</p>
            <a href="tel:+201149040303" className="text-blue-900 font-semibold hover:underline">
              +20 11 49040303
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-blue-900 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-2">General Inquiries</p>
            <a href="mailto:cncworldmachining@gmail.com" className="text-blue-900 font-semibold hover:underline">
              cncworldmachining@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-blue-900 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Workshop Location</h3>
            <p className="text-gray-600">
              123 Industrial Avenue<br />
              Tech City, TC 12345
            </p>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How Can We Help You?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <div key={index} className="border rounded-xl p-8 hover:shadow-lg transition">
                <div className="text-blue-900 mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Contact:</p>
                  <a href={`mailto:${category.contact}`} className="text-blue-900 font-semibold hover:underline">
                    {category.contact}
                  </a>
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <FaClock className="w-4 h-4" />
                    {category.responseTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Support Resources</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Access our comprehensive library of technical resources
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition cursor-pointer">
                <div className="text-blue-900 flex justify-center mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
                <button className="mt-4 text-blue-900 font-semibold hover:underline">
                  Access →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2 flex items-start gap-2">
                  <FaQuestionCircle className="text-blue-900 w-5 h-5 mt-1 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Banner */}
      <section className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">24/7 Emergency Support Available</h2>
          <p className="text-xl mb-6">For urgent machine breakdowns or critical issues</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="tel:+1234567890" 
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2 text-lg"
            >
              <FaPhone /> Call Emergency Line
            </a>
            <a 
              href="mailto:emergency@cncworldmachining.com" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-red-600 transition flex items-center gap-2 text-lg"
            >
              <FaEnvelope /> Email Emergency Support
            </a>
          </div>
        </div>
      </section>

  

      {/* Footer Note */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            CNC World Machining - Your Partner in Precision Manufacturing
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Workshop Hours: Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 2:00 PM
          </p>
        </div>
      </footer>
    </div>
        </ProtectedRoute>

  );
};

export default SupportPage;