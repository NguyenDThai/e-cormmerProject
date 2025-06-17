"use client";
import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { useAppContext } from "@/context/AppProvider";
interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton = ({ productId }: FavoriteButtonProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useAppContext();
  const [isFav, setIsFav] = useState(isFavorite(productId));

  const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const success = isFav
      ? await removeFavorite(productId)
      : await addFavorite(productId);
    if (success) {
      setIsFav(!isFav);
    }
  };
  return (
    <>
      <div
        className="absolute flex justify-center cursor-pointer items-center top-2.5 right-2.5 z-30 w-[34px] h-[34px] bg-white rounded-full"
        onClick={toggleFavorite}
      >
        {isFav ? (
          <CiHeart className="size-6 text-red-500 " />
        ) : (
          <CiHeart className="size-6 " />
        )}
      </div>
    </>
  );
};

export default FavoriteButton;
