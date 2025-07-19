
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Twitter, Linkedin, Instagram, Mail, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 bg-gradient-to-br from-resume-purple-dark to-[#1A1F2C] text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
          <div className="space-y-4 animate-slide-in-left">
            <div className="flex items-center gap-2">
              <div className="bg-resume-purple rounded-lg p-1.5">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-resume-purple-light to-resume-violet bg-clip-text text-transparent">Vireia AI</span>
            </div>
            <p className="text-resume-gray-light text-sm">
              AI-powered resume builder helping job seekers stand out and get hired faster.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-resume-gray-light hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-resume-gray-light hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-resume-gray-light hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-resume-gray-light hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                <span className="sr-only">Github</span>
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="animate-slide-in-left animate-delay-200">
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3 text-resume-gray-light">
              <li><Link to="/#how-it-works" className="hover:text-white transition-colors hover:underline">Features</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors hover:underline">Resume Templates</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors hover:underline">Pricing</Link></li>
              <li><Link to="/sign-up" className="hover:text-white transition-colors hover:underline">Get Started</Link></li>
            </ul>
          </div>
          
          <div className="animate-slide-in-left animate-delay-300">
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3 text-resume-gray-light">
              <li><Link to="/blog" className="hover:text-white transition-colors hover:underline">Career Blog</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors hover:underline">Resume Templates</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors hover:underline">Interview Tips</Link></li>
              <li><Link to="/sign-up" className="hover:text-white transition-colors hover:underline">AI Resume Builder</Link></li>
            </ul>
          </div>
          
          <div className="animate-slide-in-left animate-delay-400">
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-resume-gray-light">
              <li><Link to="/" className="hover:text-white transition-colors hover:underline">About Vireia AI</Link></li>
              <li><a href="https://github.com/SaarD00/vireia-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline">Open Source</a></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors hover:underline">Privacy Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
          <p className="text-resume-gray-light text-sm">
            © {new Date().getFullYear()} Vireia AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-resume-gray-light" />
            <a href="mailto:support@vireiaai.com" className="text-resume-gray-light hover:text-white transition-colors text-sm hover:underline">
              support@vireiaai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
