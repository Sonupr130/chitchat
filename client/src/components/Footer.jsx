import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Apple,
  Download,
} from "lucide-react";
import playstore from "../assets/playstore.png";
import apple from "../assets/apple.png";
import chitchat from "../assets/chitchat.png";

const Footer = () => {
  const footerNavs = [
    { href: "#", name: "Terms" },
    { href: "#", name: "License" },
    { href: "#", name: "Privacy" },
    { href: "#", name: "About us" },
  ];

  return (
    <footer className="pt-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 dark:text-gray-300 md:px-8">
        <div className="gap-6 justify-between md:flex">
          {/* Left section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src={chitchat} width={140} height={100} alt="" />
            </div>
            <p className="max-w-md">
              Nulla auctor metus vitae lectus iaculis, vel euismod massa
              efficitur.
            </p>

            {/* Navigation links */}
            <ul className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {footerNavs.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white duration-150"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section - App download */}
          <div className="mt-6 md:mt-0">
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Get the app
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-3">
              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg w-full sm:w-auto"
              >
                <div className="h-10 w-10">
                  <img src={apple} alt="apple_store" />
                </div>
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </a>

              {/* Play Store Button */}
              <a
                href="#"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg w-full sm:w-auto"
              >
                <div className="h-10 w-10">
                  <img src={playstore} alt="google_play" />
                </div>
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Social links and copyright */}
        <div className="mt-10 py-10 border-t border-gray-200 dark:border-gray-700">
          <div className="md:flex md:items-center md:justify-between">
            {/* Social links */}
            <div className="flex justify-center md:justify-start space-x-6 mb-6 md:mb-0">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-white"
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-center md:text-left text-sm text-blue-500 dark:text-gray-400">
              © {new Date().getFullYear()} ChitChat Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
