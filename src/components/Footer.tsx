"use client";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"; // Add Icons

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 text-gray-800 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">About Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Our platform allows you to securely receive anonymous feedback or
            messages from your community. We strive to keep communication safe
            and constructive.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">
            Useful Links
          </h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                <FaEnvelope /> Email Us
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/yourprofile" // Replace with your actual Github URL
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                <FaGithub /> Github
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/yourprofile" // Replace with your actual LinkedIn URL
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:underline hover:text-teal-600 transition-colors"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            Have questions or feedback? We’re here to help. Reach out to us
            anytime.
          </p>
          <Button className="mt-4 bg-teal-600 text-white hover:bg-teal-700 transition-colors px-4 py-2 rounded-md shadow-lg hover:shadow-xl">
            <Link href="mailto:namaygupta101201@gmail.com" target="_blank">
              Get in Touch
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-10 border-t border-gray-300 pt-6 text-center text-gray-600">
        <p>&copy; 2024 Anonymous Feedback Platform. All rights reserved.</p>
        <p className="text-sm">&copy; Namay Gupta</p>
      </div>
    </footer>
  );
};

export default Footer;
