"use client";
import { useEffect, useState } from "react";
import { FaCamera, FaHeadphones, FaMouse } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import { MdOutlineComputer, MdOutlinePhoneAndroid } from "react-icons/md";

const CategoriesList = () => {
  // const [productList, setProductList] = useState([]);

  // useEffect(() => {
  //   const fetchProductList = async () => {
  //     try {
  //       const response = await fetch("/api/product");
  //       const dataProduct = await response.json();
  //       if (!response.ok) {
  //         throw new Error("Da co loi xay ra khi lay san pham tu csdl");
  //       }
  //       setProductList(dataProduct.product);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  //   fetchProductList();
  // }, []);

  // console.log(productList);

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
