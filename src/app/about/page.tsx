"use client";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gray-900 py-32">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/about-hero.jpg"
              alt="Cửa hàng Black store"
              fill
              className="object-cover opacity-50"
              priority
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Về Black Store
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Đồng hành cùng bạn trong kỷ nguyên công nghệ số
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:flex gap-12 items-center justify-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <Image
                src="/about-our-story.jpg"
                alt="Nội thất cửa hàng"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Black store được thành lập năm 2024 với sứ mệnh mang đến những
                sản phẩm công nghệ chất lượng cao với giá cả hợp lý.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Từ một cửa hàng nhỏ tại Cần Thơ, chúng tôi đã phát triển thành
                hệ thống phân phối thiết bị điện tử hàng đầu với 15 chi nhánh
                trên toàn quốc.
              </p>
              <p className="text-lg text-gray-600">
                Chúng tôi tự hào là đối tác chính thức của các thương hiệu lớn
                như Apple, Samsung, Dell, và ASUS...,
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ),
                  title: "Chất Lượng Đảm Bảo",
                  description:
                    "Tất cả sản phẩm đều được kiểm tra nghiêm ngặt và bảo hành chính hãng",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  ),
                  title: "Giá Cả Cạnh Tranh",
                  description:
                    "Cam kết giá tốt nhất thị trường với nhiều chương trình khuyến mãi",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  ),
                  title: "Hỗ Trợ 24/7",
                  description:
                    "Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ khách hàng mọi lúc",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Đại diện của chúng tôi
          </h2>
          <div className="flex items-center justify-center">
            {[
              {
                name: "Nguyễn Đức Thái",
                position: "CEO & Founder",
                image: "/148669147.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-blue-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Sẵn sàng trải nghiệm dịch vụ của chúng tôi?
            </h2>
            <p className="text-xl mb-8">Liên hệ ngay để được tư vấn miễn phí</p>
            <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300">
              Liên Hệ Ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
