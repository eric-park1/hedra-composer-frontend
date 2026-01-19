import React, { useState } from 'react';
import { 
    IconVeo, IconDetailsMovement, IconMovement, IconUploadMovement,
    IconDollyIn, IconDollyOut, IconCustomMove, IconCloseSmall, IconPlusSmall 
} from './Icons'; 

import PerspectiveOne from '../assets/PerspectiveOne.png';
import PerspectiveTwo from '../assets/PerspectiveTwo.png';
import PerspectiveThree from '../assets/PerspectiveThree.png';

const SHADOW_STATE_4 = "inset 0px -2px 4px 1px rgba(255, 255, 255, 0.05), inset 0px -5px 5px 1px rgba(0, 0, 0, 0.4), inset 0px 5px 6px 1px rgba(255, 255, 255, 0.12), inset 0px 5px 6px 1px rgba(255, 255, 255, 0.12)";

const IconArrowUp = ({ className }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 13V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8H1" stroke="#D4D4D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15L1 8L8 1" stroke="#D4D4D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12" stroke="#D4D4D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4L12 12" stroke="#D4D4D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin text-white" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// --- OVERLAY BUTTON COMPONENT ---
const OverlayButton = ({ state, Icon, onClick }) => {
    let styles = {
        boxShadow: 'none',
        backgroundColor: 'transparent',
        color: '#D4D4D8'
    };
    
    if (state === 2) {
        styles.backgroundColor = '#29292E';
        styles.boxShadow = "inset 0px -2px 4px 1px rgba(255,255,255,0.05), inset 0px -5px 5px 1px rgba(0,0,0,0.40), inset 0px 5px 6px 1px rgba(255,255,255,0.12), inset 0px 5px 6px 1px rgba(255,255,255,0.12)";
        styles.color = '#D4D4D8';
    } else if (state === 4) {
        styles.backgroundColor = '#C9CEFF'; 
        styles.boxShadow = SHADOW_STATE_4;
        styles.color = '#18181B'; 
    }

    return (
        <button 
            onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}
            style={styles}
            className="h-[32px] w-[32px] rounded flex items-center justify-center transition-all duration-200"
        >
            <Icon />
        </button>
    );
};

export default function PerspectiveTool({ style, onClose, onUpdateTrack, toolboxHeight = 380, toolboxLeft = 4 }) {
  const [view, setView] = useState('input');
  const [text, setText] = useState('');
  
  const [mainImage, setMainImage] = useState(PerspectiveOne);
  const [subImages, setSubImages] = useState([PerspectiveTwo, PerspectiveThree]);
  
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [popupView, setPopupView] = useState('details'); 
  
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [movementMenuOpen, setMovementMenuOpen] = useState(false);
  const [movementState, setMovementState] = useState('default'); 

  const isActive = text.length > 0;

  // --- HANDLERS ---

  const handleSend = () => {
    setView('loading');
    setTimeout(() => {
      setView('results');
    }, 2000); 
  };

  const handleImageClick = (indexToSwap) => {
    const newMain = subImages[indexToSwap];
    const newSub = [...subImages];
    newSub[indexToSwap] = mainImage; 
    setMainImage(newMain);
    setSubImages(newSub);
  };

  const handleMovementOptionClick = (type) => {
    setMovementMenuOpen(false);
    if (type === 'custom') {
        setPopupView('custom');
        setShowDetailsPopup(true);
    } else {
        setMovementState(type);
        setText(type === 'in' ? "Dolly in" : "Dolly out");
    }
  };

  const handleDetailsButtonClick = () => {
      setPopupView('details');
      setShowDetailsPopup(true);
  };

  const handleUploadClick = () => {
      if (onUpdateTrack) {
          onUpdateTrack(mainImage);
      }
  };

  const getMovementIcon = () => {
      if (movementState === 'in') return IconDollyIn;
      if (movementState === 'out') return IconDollyOut;
      return IconMovement;
  };

  const getMovementButtonState = () => {
      return movementState === 'default' ? 2 : 4;
  };

  const containerHeight = view === 'results' ? 'auto' : '154px';

  return (
    <>
        {/* --- LARGE DETAILS POPUP --- */}
        {showDetailsPopup && (
            <div 
                className="fixed z-[80] bg-woodsmoke-light border border-shark-light rounded-[8px] flex flex-col box-border shadow-2xl p-[16px]"
                style={{
                    top: '8px', 
                    left: `${toolboxLeft}px`, 
                    width: '900px',
                    height: `calc(100vh - ${toolboxHeight}px - 16px)`, 
                }}
            >
                {/* --- HEADER --- */}
                <div className="flex items-center justify-between w-full h-[24px] mb-[12px] shrink-0">
                    <div>
                        {popupView === 'custom' && (
                            <div className="cursor-pointer hover:opacity-80" onClick={() => setPopupView('details')}>
                                <IconArrowLeft />
                            </div>
                        )}
                    </div>
                    <div className="cursor-pointer hover:opacity-80" onClick={() => setShowDetailsPopup(false)}>
                        <IconClose />
                    </div>
                </div>

                {/* --- CONTENT WRAPPER --- */}
                <div className="flex flex-row w-full h-[320px] mt-auto">
                    
                    {/* LEFT COLUMN */}
                    <div className="flex-1 flex flex-col h-full mr-[16px] relative justify-end gap-[16px]">
                        
                        {/* Top Content */}
                        <div className="w-full">
                            {popupView === 'details' ? (
                                <>
                                    <p className="font-geist font-normal text-[14px] leading-[21px] text-iron-dark mb-[12px] text-left">
                                        I’ve generated the subject from three different angles based on what you’ve asked.
                                        <br /><br />
                                        Here is a preview of the each one:
                                    </p>
                                    <div className="flex gap-[5px]">
                                        {subImages.map((img, index) => (
                                            <div 
                                                key={index} 
                                                className="flex-1 h-[60px] relative cursor-pointer group"
                                                onClick={() => handleImageClick(index)}
                                            >
                                                <img 
                                                    src={img} 
                                                    alt={`Perspective ${index}`} 
                                                    className="w-full h-full object-cover rounded-[4px] opacity-80 group-hover:opacity-100 group-hover:border group-hover:border-lightning-yellow transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-[62px] bg-woodsmoke-dark border border-shark-light rounded-[4px] flex items-center px-[12px] cursor-pointer hover:border-iron-dark/50 transition-colors">
                                    <div className="w-[32px] h-[32px] bg-shark-light rounded-[2px] flex items-center justify-center mr-[12px]">
                                        <div className="text-iron-light"><IconPlusSmall /></div>
                                    </div>
                                    <span className="font-geist text-[14px] text-iron-light">Add End Frame</span>
                                </div>
                            )}
                        </div>

                        {/* Bottom Content (Text Area + Buttons) */}
                        <div className="bg-woodsmoke-dark border border-shark-light rounded-[4px] p-[8px]">
                            <textarea
                                className="w-full h-[96px] bg-woodsmoke-dark rounded-[2px] p-2 resize-none font-geist font-normal text-[14px] leading-[21px] text-iron-dark placeholder-[#71747A] focus:outline-none transition-colors"
                                placeholder="Describe the movement..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            
                            <div className="flex flex-row items-center mt-[8px]">
                                {/* LEFT SIDE: Veo Info */}
                                <div className="flex items-center">
                                    <div className="w-[6px]" /> 
                                    <IconVeo />
                                    <div className="w-[8px]" />
                                    <span className="font-geist text-[14px] leading-[19.6px] font-medium text-[#D4D4D8]">
                                        Veo 3.1
                                    </span>
                                </div>

                                {/* RIGHT SIDE: Movement & Upload Buttons */}
                                <div className="ml-auto flex gap-[8px] relative">
                                    
                                    {/* Movement Button */}
                                    <div className="relative">
                                        {movementMenuOpen && (
                                            <div className="absolute bottom-full right-0 mb-[4px] w-[100px] bg-woodsmoke-light border border-shark-light rounded-[4px] p-1 flex flex-col gap-1 z-50 shadow-lg">
                                                <div 
                                                    className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                    onClick={() => handleMovementOptionClick('in')}
                                                >
                                                    <IconDollyIn /> <span className="font-geist text-[12px] text-iron-dark">Dolly in</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                    onClick={() => handleMovementOptionClick('out')}
                                                >
                                                    <IconDollyOut /> <span className="font-geist text-[12px] text-iron-dark">Dolly out</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                    onClick={() => handleMovementOptionClick('custom')}
                                                >
                                                    <IconCustomMove /> <span className="font-geist text-[12px] text-iron-dark">Custom</span>
                                                </div>
                                            </div>
                                        )}
                                        <OverlayButton 
                                            state={getMovementButtonState()} 
                                            Icon={getMovementIcon()} 
                                            onClick={() => setMovementMenuOpen(!movementMenuOpen)}
                                        />
                                    </div>

                                    {/* Upload Button */}
                                    <OverlayButton 
                                        state={4} 
                                        Icon={IconUploadMovement} 
                                        onClick={handleUploadClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Large Image) */}
                    <div className="shrink-0 w-[576px] h-full flex flex-col justify-end">
                        <img 
                            src={mainImage} 
                            alt="Large Detail" 
                            className="w-full h-full object-cover rounded-[8px] border border-shark-light"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* --- MAIN PERSPECTIVE TOOL POPUP (Small) --- */}
        <div 
            className="fixed z-[70] bg-woodsmoke-light border border-shark-light rounded-[4px] p-[8px] flex flex-col box-border shadow-xl transition-all duration-300 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-shark-light scrollbar-track-transparent"
            style={{
                width: '338px',
                height: containerHeight,
                ...style 
            }}
            onMouseDown={(e) => e.stopPropagation()} 
            onClick={(e) => e.stopPropagation()}
        >
        
        {/* --- VIEW 1: INPUT --- */}
        {view === 'input' && (
            <>
            <textarea
                className="w-full h-[96px] bg-woodsmoke-light rounded-[2px] p-2 resize-none font-geist font-normal text-[14px] leading-[21px] text-iron-dark placeholder-[#71747A] focus:outline-none transition-colors"
                placeholder="Describe the new perspective."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div className="flex-1 flex flex-row items-center mt-[8px]">
                <div className="w-[6px]" /> 
                <IconVeo />
                <div className="w-[8px]" />
                <span className="font-geist text-[14px] leading-[19.6px] font-medium text-[#D4D4D8]">
                    Veo 3.1
                </span>

                <button 
                    onClick={handleSend}
                    className={`ml-auto mr-[6px] h-[30px] w-[30px] rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive ? 'bg-custom-blue' : 'bg-shark-light'
                    }`}
                >
                    <IconArrowUp className={isActive ? 'text-woodsmoke-light' : 'text-jumbo'} />
                </button>
            </div>
            </>
        )}

        {/* --- VIEW 2: LOADING --- */}
        {view === 'loading' && (
            <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner />
            </div>
        )}

        {/* --- VIEW 3: RESULTS --- */}
        {view === 'results' && (
            <div className="flex flex-col w-full items-center">
            
            <div className="w-full flex flex-col">
                
                <p className="font-geist font-normal text-[14px] leading-[21px] text-iron-dark mb-[12px] text-left">
                I’ve generated the subject from three different angles based on what you’ve asked.
                <br /><br />
                Here is a preview of the each one:
                </p>

                <div className="flex flex-col gap-[5px]">
                
                {/* Main Perspective - Hover Area */}
                <div 
                    className="relative w-full h-[150px] group"
                    onMouseEnter={() => setIsHoveringMain(true)}
                    onMouseLeave={() => setIsHoveringMain(false)}
                >
                    <img 
                        src={mainImage} 
                        alt="Perspective Main" 
                        className="w-full h-full object-cover rounded-[4px] cursor-pointer hover:opacity-95 transition-opacity"
                    />

                    {/* OVERLAY BUTTONS */}
                    {isHoveringMain && (
                        <>
                            {/* Top Right */}
                            <div className="absolute top-[8px] right-[8px]">
                                <OverlayButton 
                                    state={2} 
                                    Icon={IconDetailsMovement} 
                                    onClick={handleDetailsButtonClick} 
                                />
                            </div>

                            {/* Bottom Right Container */}
                            <div className="absolute bottom-[8px] right-[8px] flex gap-[8px]">
                                <div className="relative">
                                    {movementMenuOpen && (
                                        <div className="absolute bottom-full left-0 mb-[4px] w-[100px] bg-woodsmoke-light border border-shark-light rounded-[4px] p-1 flex flex-col gap-1 z-50 shadow-lg">
                                            <div 
                                                className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                onClick={() => handleMovementOptionClick('in')}
                                            >
                                                <IconDollyIn /> <span className="font-geist text-[12px] text-iron-dark">Dolly in</span>
                                            </div>
                                            <div 
                                                className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                onClick={() => handleMovementOptionClick('out')}
                                            >
                                                <IconDollyOut /> <span className="font-geist text-[12px] text-iron-dark">Dolly out</span>
                                            </div>
                                            <div 
                                                className="flex items-center gap-2 p-1 hover:bg-woodsmoke-dark rounded cursor-pointer"
                                                onClick={() => handleMovementOptionClick('custom')}
                                            >
                                                <IconCustomMove /> <span className="font-geist text-[12px] text-iron-dark">Custom</span>
                                            </div>
                                        </div>
                                    )}
                                    <OverlayButton 
                                        state={getMovementButtonState()} 
                                        Icon={getMovementIcon()} 
                                        onClick={() => setMovementMenuOpen(!movementMenuOpen)}
                                    />
                                </div>
                                
                                <OverlayButton 
                                    state={4} 
                                    Icon={IconUploadMovement} 
                                    onClick={handleUploadClick}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Thumbnails Row */}
                <div className="w-full flex gap-[5px]">
                    {subImages.map((img, index) => (
                        <div 
                            key={index}
                            className="flex-1 h-[60px] relative"
                        >
                            <img 
                                src={img} 
                                alt={`Perspective ${index}`} 
                                className="w-full h-full object-cover rounded-[4px] cursor-pointer hover:opacity-80 transition-opacity border border-transparent hover:border-lightning-yellow"
                                onClick={() => handleImageClick(index)}
                            />
                        </div>
                    ))}
                </div>

                </div>
            </div>
            </div>
        )}

        {/* Decorative Arrow */}
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-woodsmoke-light border-r border-b border-shark-light rotate-45"></div>
        </div>
    </>
  );
}