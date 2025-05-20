export default function Footer() {
  return (
    <footer className="py-6 sm:py-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="text-primary text-2xl">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <h2 className="text-xl font-bold">CyberViz</h2>
        </div>        <div className="flex flex-wrap justify-center gap-4 sm:space-x-6 text-gray-400 text-sm sm:text-base px-2">
          <a href="/about" className="hover:text-primary transition-colors">About</a>
          <a href="mailto:itssukmadhe@gmail.com" className="hover:text-primary transition-colors">Contact</a>
        </div>        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://github.com/SuKMaDhe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
            <i className="ri-github-fill text-xl sm:text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">
            <i className="ri-twitter-fill text-xl sm:text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-primary transition-colors">
            <i className="ri-linkedin-box-fill text-xl sm:text-2xl"></i>
          </a>
        </div>
      </div>
      <div className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 px-4">
        © {new Date().getFullYear()} CyberViz. All rights reserved. An educational project for cybersecurity learning.
      </div>
    </footer>
  );
}
