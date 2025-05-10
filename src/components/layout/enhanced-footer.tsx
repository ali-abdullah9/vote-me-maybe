// src/components/layout/enhanced-footer.tsx
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear();
  
  const footerLinkHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  const iconHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <footer className="relative border-t border-gray-800 bg-black/30 backdrop-blur-sm">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-4"
          variants={containerAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Logo and Description */}
          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">VoteMeMaybe</h3>
            <p className="text-gray-400 text-sm">
              A secure blockchain-based voting platform for transparent and tamper-proof decision making.
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-4">
              <motion.a 
                href="https://github.com/yourusername/votememaybe" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                initial="rest"
                variants={iconHover}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">GitHub</span>
              </motion.a>
              
              <motion.a 
                href="https://www.linkedin.com/in/ali-abdullah-75682027a/" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                initial="rest"
                variants={iconHover}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              
              <motion.a 
                href="https://www.instagram.com/ali_ab_dullah_/" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover="hover"
                initial="rest"
                variants={iconHover}
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Instagram</span>
              </motion.a>
            </div>
          </motion.div>
          
          {/* Navigation Links */}
          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold text-white">Navigation</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', href: '/' },
                { name: 'Proposals', href: '/proposals' },
                { name: 'Analytics', href: '/analytics' },
                { name: 'Dashboard', href: '/dashboard' }
              ].map((item) => (
                <motion.li key={item.name} variants={footerLinkHover} initial="rest" whileHover="hover">
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center"
                  >
                    <span className="mr-2 h-1 w-1 rounded-full bg-purple-500/50"></span>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Resources Links */}
          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-3 text-sm">
              <motion.li variants={footerLinkHover} initial="rest" whileHover="hover">
                <Link 
                  href="/help" 
                  className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-purple-500/50"></span>
                  Help Center
                </Link>
              </motion.li>
              <motion.li variants={footerLinkHover} initial="rest" whileHover="hover">
                <a 
                  href="https://ethereum.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-purple-500/50"></span>
                  Ethereum
                </a>
              </motion.li>
              <motion.li variants={footerLinkHover} initial="rest" whileHover="hover">
                <a 
                  href="https://github.com/ali-abdullah9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-purple-500/50"></span>
                  GitHub Repository
                </a>
              </motion.li>
              <motion.li variants={footerLinkHover} initial="rest" whileHover="hover">
                <a 
                  href="/docs/api" 
                  className="text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center"
                >
                  <span className="mr-2 h-1 w-1 rounded-full bg-purple-500/50"></span>
                  API Documentation
                </a>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Newsletter/Settings */}
          <motion.div variants={itemAnimation}>
            <h3 className="mb-4 text-lg font-semibold text-white">Stay Updated</h3>
            <div className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-l-md bg-gray-800 py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button className="rounded-r-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Get updates about new features and proposals
              </p>
            </div>
            
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-white">Theme</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <ThemeToggle />
                <span className="text-xs text-gray-400">Switch between light and dark mode</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Footer bottom section */}
        <motion.div 
          className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          variants={itemAnimation}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          <p className="text-xs text-gray-500">
            &copy; {currentYear} VoteMeMaybe. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}