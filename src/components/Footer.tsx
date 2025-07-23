import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quibusdam, voluptates.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Liên hệ với chúng tôi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Thông tin của chúng tôi</h3>
            <address className="text-gray-400 not-italic">
              Ninh Kieu
              <br />
              Can Tho City
              <br />
              Email: thainguyen464@gmail.com
              <br />
              Phone: 0869240149
            </address>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Thai Dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
