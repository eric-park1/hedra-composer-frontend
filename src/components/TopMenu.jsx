// components/TopMenu.jsx
import React from 'react';
import { ArrowLeft, AspectRatio, ArrowUpDown } from './Icons'; 

export default function TopMenu() {
    return (
        // Parent: 72px Height, Black BG, 16px Padding all around
        <div className="w-full h-[72px] shrink-0 bg-black flex flex-col justify-center px-[16px]">
            
            {/* Inner Content: Spans full width, splits Left and Right */}
            <div className="flex items-center justify-between w-full h-full">

                {/* --- LEFT SIDE --- */}
                <div className="flex items-center">
                    {/* 10px Space */}
                    <div className="w-[10px]" /> 
                    
                    {/* Arrow Icon (Grey default, White hover) */}
                    <div className="text-icon-base cursor-pointer hover:text-white transition-colors">
                        <ArrowLeft />
                    </div>

                    {/* 12px Space */}
                    <div className="w-[12px]" /> 

                    {/* Text */}
                    <span className="text-med-14 text-alabaster truncate">
                        Composition with generated vid...
                    </span>
                </div>


                {/* --- RIGHT SIDE --- */}
                <div className="flex items-center">
                    
                    {/* 1. Container 98x40 */}
                    <div className="w-[98px] h-[40px] flex items-center justify-center cursor-pointer rounded hover:bg-woodsmoke-light transition-colors">
                         <div className="text-iron-dark">
                            <AspectRatio />
                         </div>

                         {/* 6px Space */}
                         <div className="w-[6px]" />

                         <span className="text-med-14 text-iron-dark">
                            16:9
                         </span>

                         {/* 6px Space */}
                         <div className="w-[6px]" />

                         <div className="text-iron-dark">
                            <ArrowUpDown />
                         </div>
                    </div>

                    {/* 2. 8px Space */}
                    <div className="w-[8px]" />

                    {/* 3. Container 112x36 (Export Button) */}
                    <button className="w-[112px] h-[36px] bg-[#4F46E5] hover:bg-[#4338ca] rounded-[8px] flex items-center justify-center text-med-14 text-alabaster transition-colors">
                        Export video
                    </button>

                </div>

            </div>

        </div>
    );
}