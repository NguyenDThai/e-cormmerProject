"use client";
import { useRouter } from "next/navigation";
import { FaHeadphones, FaMouse } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import { MdOutlineComputer, MdOutlinePhoneAndroid } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";

const categories = [
  {
    name: "phone",
    label: "Phone",
    icon: <MdOutlinePhoneAndroid className="size-[56px]" />,
  },
  {
    name: "mouse",
    label: "Chuột máy tính",
    icon: <FaMouse className="size-[56px]" />,
  },
  {
    name: "airport",
    label: "Airport",
    icon: <FaHeadphones className="size-[56px]" />,
  },
  {
    name: "laptop",
    label: "Máy tính",
    icon: <MdOutlineComputer className="size-[56px]" />,
  },
  {
    name: "gaming",
    label: "Gaming",
    icon: <IoGameController className="size-[56px]" />,
  },
  {
    name: "camera",
    label: "Camera",
    icon: <GiCctvCamera className="size-[56px]" />,
  },
  {
    name: "other",
    label: "Other",
    icon: <IoIosMore className="size-[56px]" />,
  },
];

const CategoriesList = () => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/product?category=${category}`);
  };
  return (
    <div className="flex justify-between mt-14">
      {categories.map((cat) => (
        <div
          key={cat.name}
          onClick={() => handleCategoryClick(cat.name)}
          className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
        >
          {cat.icon}
          <span className="text-lg">{cat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoriesList;
