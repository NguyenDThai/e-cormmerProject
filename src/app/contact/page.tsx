"use client";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

type SubmitStatus = "success" | "error" | null;
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Giả lập gửi form (thay bằng API call thực tế)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Liên Hệ - Black Store</title>
        <meta
          name="description"
          content="Liên hệ với Black Store - Cửa hàng thiết bị điện tử uy tín"
        />
      </Head>

      <div className="bg-white">
        {/* Hero Banner với hình ảnh nền tối ưu */}
        <div className="relative bg-gray-900 py-24 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/contact-banner.jpg"
              alt="Liên hệ Black store"
              fill
              className="object-cover opacity-70"
              priority
              quality={90}
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl max-w-2xl mx-auto">
              Mọi thắc mắc và yêu cầu hỗ trợ xin vui lòng liên hệ
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ
                      liên hệ lại sớm nhất.
                    </span>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0869 240 149"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Xin vui lòng nhập nội dung tin nhắn..."
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 ${
                      isSubmitting
                        ? "opacity-80 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      "Gửi tin nhắn"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Thông Tin Liên Hệ
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Địa chỉ cửa hàng
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Khu 2 Đại Học Cần Thơ, Đường 3 tháng 2, Phường Xuân
                          Khánh, Quận Ninh Kiều, Thành Phố Cần Thơ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <FaPhone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Điện thoại
                        </h3>
                        <p className="text-gray-600 mt-1">
                          <a
                            href="tel:+84869240149"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            0869 240 149
                          </a>{" "}
                          (Hotline)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Email
                        </h3>
                        <p className="text-gray-600 mt-1">
                          <a
                            href="mailto:thaidc2096n534@vlvh.ctu.edu.vn"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            thaidc2096n534@vlvh.ctu.edu.vn
                          </a>
                          <br />
                          <a
                            href="mailto:support@blackstore.vn"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            support@blackstore.vn
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <FaClock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Giờ mở cửa
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Thứ 2 - Thứ 6: 8:00 - 21:00
                          <br />
                          Thứ 7 - Chủ nhật: 9:00 - 22:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Kết nối với chúng tôi
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/nguyen.uc.thai.201420/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition"
                    >
                      <FaFacebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://chat.zalo.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition"
                    >
                      <SiZalo className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="rounded-xl shadow-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841075209572!2d105.7680403!3d10.0299337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-xl"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Cần hỗ trợ ngay lập tức?
            </h2>
            <p className="text-lg mb-6">
              Gọi cho chúng tôi bất kỳ lúc nào từ 8:00 - 22:00 hàng ngày
            </p>
            <a
              href="tel:+84869240149"
              className="inline-flex items-center bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg"
            >
              <FaPhone className="mr-2" />
              0869 240 149
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
