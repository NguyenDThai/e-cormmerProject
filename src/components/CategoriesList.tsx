"use client";
import { FaCamera, FaHeadphones, FaMouse } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import { MdOutlineComputer, MdOutlinePhoneAndroid } from "react-icons/md";

const CategoriesList = () => {
  return (
    <div className="flex justify-between mt-14">
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <MdOutlinePhoneAndroid className="size-[56px]" />
        <span className="text-lg">Phone</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <FaMouse className="size-[56px]" />
        <span className="text-lg">Chuột máy tính</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <FaHeadphones className="size-[56px]" />
        <span className="text-lg">AirPort</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <MdOutlineComputer className="size-[56px]" />
        <span className="text-lg">Máy tính</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <IoGameController className="size-[56px]" />
        <span className="text-lg">Gaming</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <FaCamera className="size-[56px]" />
        <span className="text-lg">Camera</span>
      </div>
      <div className="w-[170px] h-[145px] border border-slate-300 flex flex-col justify-center items-center rounded-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-all ">
        <IoIosMore className="size-[56px]" />
        <span className="text-lg">Orther</span>
      </div>
    </div>
  );
};

export default CategoriesList;
