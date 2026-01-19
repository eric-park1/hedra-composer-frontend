// Sidebar.jsx
import React, { useState } from 'react';
import { IconHome, IconLibrary, IconAssets, IconImage, IconVideo, IconComposer, IconAudio, IconTemplates, SidebarBottom } from './Icons';

// 1. Reusable Button Component
const ToolbarButton = ({ Icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-200
        ${isActive 
          ? 'tool-btn-active text-icon-active' 
          : 'bg-transparent text-icon-base hover:text-white' 
        }
      `}
    >
      <Icon />
    </button>
  );
};

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(3); 

  return (
    <nav className="w-[69px] h-screen bg-black border-r border-woodsmoke-light flex flex-col items-center pt-[8px]">

      {/* Spacer */}
      <div className="h-[8px]"></div>

      {/* COMPONENT #1 (Top Icons) */}
      <div className="w-[60px] h-[44px] bg-black hover:bg-woodsmoke-light rounded cursor-pointer mb-[10px] flex items-center justify-center text-icon-base hover:text-white transition-colors">
        <span className="text-xs"><IconHome/></span>
      </div>
      
      <div className="w-[60px] h-[44px] bg-black hover:bg-woodsmoke-light rounded cursor-pointer mb-[10px] flex items-center justify-center text-icon-base hover:text-white transition-colors">
        <span className="text-xs"><IconLibrary/></span>
      </div>

      <div className="w-[60px] h-[44px] bg-black hover:bg-woodsmoke-light rounded cursor-pointer mb-[10px] flex items-center justify-center text-icon-base hover:text-white transition-colors">
        <span className="text-xs"><IconAssets/></span>
      </div>

      {/* COMPONENT #2 (The Tool Strip) */}
      <div className="w-[46px] h-auto min-h-[222px] bg-woodsmoke-light rounded-full flex flex-col items-center py-[4px] gap-[6px] mt-4">
        
        <ToolbarButton 
          Icon={IconImage} 
          isActive={activeTab === 1} 
          onClick={() => setActiveTab(1)} 
        />
        
        <ToolbarButton 
          Icon={IconVideo} 
          isActive={activeTab === 2} 
          onClick={() => setActiveTab(2)} 
        />

        <ToolbarButton 
          Icon={IconComposer} 
          isActive={activeTab === 3} 
          onClick={() => setActiveTab(3)} 
        />

        <ToolbarButton 
          Icon={IconAudio} 
          isActive={activeTab === 4} 
          onClick={() => setActiveTab(4)} 
        />

        <ToolbarButton 
          Icon={IconTemplates} 
          isActive={activeTab === 5} 
          onClick={() => setActiveTab(5)} 
        />

      </div>

      {/* COMPONENT #3 (User Profile, Help, Tokens) */}
      <div className="mt-auto mb-[16px] cursor-pointer text-icon-base hover:text-white transition-colors">
        <SidebarBottom />
      </div>

    </nav>
  );
}