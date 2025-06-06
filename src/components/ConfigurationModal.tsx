/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

type ConfigField = {
  label: string;
  key: string;
  render?: (val: any) => string; // Thuộc tính optional
};

const categoryConfigMap: Record<string, ConfigField[]> = {
  laptop: [
    { label: "CPU", key: "cpu" },
    { label: "GPU", key: "gpu" },
    { label: "RAM (GB)", key: "ram" },
    { label: "Ổ cứng (GB)", key: "storage" },
    { label: "Màn hình (inch)", key: "screenSize" },
  ],
  phone: [
    { label: "Bộ xử lý", key: "processor" },
    { label: "RAM (GB)", key: "ram" },
    { label: "Bộ nhớ (GB)", key: "storage" },
    { label: "Pin (mAh)", key: "battery" },
    { label: "Màn hình (inch)", key: "screenSize" },
  ],
  camera: [
    { label: "Độ phân giải (MP)", key: "sensorResolution" },
    { label: "Ống kính", key: "lensType" },
    { label: "Độ phân giải video", key: "videoResolution" },
  ],
  gaming: [
    { label: "Loại thiết bị", key: "type" },
    {
      label: "Tính năng",
      key: "features",
      render: (val: string[]) => val.join(", "),
    },
    { label: "RAM (GB)", key: "ram" },
  ],
  default: [
    { label: "RAM (GB)", key: "ram" },
    { label: "Bộ nhớ (GB)", key: "storage" },
    { label: "Màn hình (inch)", key: "screenSize" },
  ],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const ConfigurationModal = ({
  configuration = {},
  category = "default",
}: {
  configuration?: any;
  category?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lấy cấu hình theo danh mục
  const fields =
    categoryConfigMap[category as keyof typeof categoryConfigMap] ||
    categoryConfigMap.default;

  // Kiểm tra nếu không có cấu hình nào
  const hasConfiguration = fields.some((field) => configuration[field.key]);

  if (!hasConfiguration) {
    return (
      <p className="text-gray-500 text-sm">
        Sản phẩm này chưa có thông số kỹ thuật
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-500 hover:underline cursor-pointer"
      >
        Xem cấu hình
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                  const value = configuration[field.key];
                  if (!value) return null;

                  return (
                    <div key={field.key} className="space-y-1">
                      <p className="font-medium text-gray-700">
                        {field.label}:
                      </p>
                      <p className="text-gray-900">
                        {field?.render ? field?.render(value) : value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigurationModal;
