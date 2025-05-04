import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left text-lg font-semibold">
          © {new Date().getFullYear()} New One. All rights reserved.
        </div>

        <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end space-x-6 text-2xl">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 hover:scale-110 transition-transform duration-300">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 hover:scale-110 transition-transform duration-300">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-100 hover:scale-110 transition-transform duration-300">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
