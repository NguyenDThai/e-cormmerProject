"use client";

import React from "react";
import { FlashSale } from "@/types/flashSale";
import Coundown from "./Coundown";

interface FlashSaleBannerProps {
  flashSale: FlashSale;
  onExpire?: () => void;
}

const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ flashSale, onExpire }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-xl shadow-lg mb-6 animate-fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-4 right-1/3 w-12 h-12 bg-white/5 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mr-3">
                ⚡ FLASH SALE
              </span>
              <span className="bg-yellow-400 text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                -{flashSale.discountPercent}% OFF
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {flashSale.name}
            </h2>
            
            {flashSale.description && (
              <p className="text-white/90 text-sm md:text-base mb-3">
                {flashSale.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {flashSale.totalSold > 0 && (
                <div className="flex items-center">
                  <span className="mr-1">🔥</span>
                  <span>Đã bán: <strong>{flashSale.totalSold}</strong></span>
                </div>
              )}
              
              {flashSale.maxQuantityPerUser && (
                <div className="flex items-center">
                  <span className="mr-1">👤</span>
                  <span>Tối đa: <strong>{flashSale.maxQuantityPerUser}</strong> sản phẩm/khách</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center">
            <div className="text-xs uppercase tracking-wide mb-2 text-white/80">
              Kết thúc sau:
            </div>
            {flashSale.endTime && (
              <Coundown 
                endTime={new Date(flashSale.endTime)} 
                onExpire={onExpire}
              />
            )}
            <div className="text-xs mt-2 text-white/80">
              Mua ngay! 🛍️
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (if applicable) */}
      {flashSale.totalSold > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
            style={{ 
              width: `${Math.min((flashSale.totalSold / 100) * 100, 100)}%` 
            }}
          ></div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlashSaleBanner;
