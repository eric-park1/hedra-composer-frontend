import React, { useState, useRef, useEffect } from 'react';
import { 
  IconChevronDown, IconUndo, IconRedo, IconExtend, IconSelectClip, 
  IconRemix, IconPerspective, IconRemoveObject, IconApplyTemplate, 
  IconTrim, IconTrash, IconAdd, IconExport, 
  IconPlay, IconPause, IconRewind, IconFastForward,
  IconMinus, IconPlusSmall, IconPlusLarge
} from './Icons'; 

import UGCVideo from '../assets/UGCVideo.mp4';
import PerspectiveTool from './PerspectiveTool';

// --- STYLE CONSTANTS ---
const SHADOW_STATE_1 = "inset 0px 2px 4px 0px rgba(0,0,0,0.25), inset 0px 2px 4px 0px rgba(0,0,0,0.25), inset 0px 2px 4px 0px rgba(0,0,0,0.25)";
const SHADOW_STATE_2_3 = "inset 0px -2px 4px 1px rgba(255,255,255,0.05), inset 0px -5px 5px 1px rgba(0,0,0,0.40), inset 0px 5px 6px 1px rgba(255,255,255,0.12), inset 0px 5px 6px 1px rgba(255,255,255,0.12)";

export default function EditorWorkspace() {
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // VIDEO STATE
  const [videoSrc] = useState(UGCVideo);
  const [trackSegments, setTrackSegments] = useState([]);

  // UNDO / REDO HISTORY STATE
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [durationSecs, setDurationSecs] = useState(0); 
  const [currentTimeSecs, setCurrentTimeSecs] = useState(0); 
  
  // ZOOM STATE
  const [zoomLevel, setZoomLevel] = useState(50);
  
  // --- INTERACTION STATES ---
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null); 
  const [lockedSegmentIndex, setLockedSegmentIndex] = useState(null);     
  
  const [isSelectionMode, setIsSelectionMode] = useState(false); 
  const [isExtendMode, setIsExtendMode] = useState(false); 
  
  const [activePopupId, setActivePopupId] = useState(null); 
  const [isPerspectiveOpen, setIsPerspectiveOpen] = useState(false);
  const [perspectivePos, setPerspectivePos] = useState({ bottom: 0, left: 0 });
  
  // Selection / Highlight Logic
  const [dragStart, setDragStart] = useState(null); 
  const [dragCurrent, setDragCurrent] = useState(null); 
  const [selectionRange, setSelectionRange] = useState(null); 

  const timelineContainerRef = useRef(null);
  const toolboxRef = useRef(null);
  
  // Layout Measurements
  const [toolboxHeight, setToolboxHeight] = useState(380);
  const [toolboxLeft, setToolboxLeft] = useState(0); // NEW: Track X position
  const [containerWidth, setContainerWidth] = useState(1000);
  
  const videoRef = useRef(null);

  // --- CALCULATIONS ---
  const pixelsPerSecond = 10 + (zoomLevel * 1.3);
  const contentWidth = durationSecs * pixelsPerSecond;
  const totalTimelineWidth = Math.max(contentWidth + 200, containerWidth);

  let rulerInterval = 5; 
  if (zoomLevel < 20) rulerInterval = 15;
  else if (zoomLevel > 80) rulerInterval = 1;

  // --- HELPER: Find Segment at Time ---
  const getSegmentIndexAtTime = (time) => {
      if (time >= durationSecs - 0.01) return trackSegments.length - 1;
      return trackSegments.findIndex(seg => time >= seg.start && time < seg.end);
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (durationSecs > 0 && trackSegments.length === 0) {
        const initialSegments = [{ type: 'video', start: 0, end: durationSecs }];
        setTrackSegments(initialSegments);
        setHistory([initialSegments]);
        setHistoryIndex(0);
    }
  }, [durationSecs]);

  // Unified Layout Update Effect
  useEffect(() => {
    const updateLayout = () => {
        if (toolboxRef.current) {
            const rect = toolboxRef.current.getBoundingClientRect();
            setToolboxHeight(toolboxRef.current.offsetHeight);
            setToolboxLeft(rect.left); // Capture Left Position
        }
        if (timelineContainerRef.current) {
            setContainerWidth(timelineContainerRef.current.offsetWidth);
        }
    };

    window.addEventListener('resize', updateLayout);
    // Call immediately and slightly delayed to ensure DOM is settled
    updateLayout();
    setTimeout(updateLayout, 100);

    return () => window.removeEventListener('resize', updateLayout);
  }, [isToolboxCollapsed]);


  // --- HANDLERS ---

  const handleResetState = () => {
    setSelectedSegmentIndex(null);
    setLockedSegmentIndex(null);
    setIsSelectionMode(false);
    setIsExtendMode(false);
    setSelectionRange(null);
    setActivePopupId(null);
    setIsPerspectiveOpen(false);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLoadedMetadata = (e) => {
    setDurationSecs(e.target.duration);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTimeSecs(e.target.currentTime);
  };

  const togglePlay = (e) => {
    e.stopPropagation(); 
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // --- HISTORY MANAGEMENT ---
  const addToHistory = (newSegments) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newSegments);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setTrackSegments(newSegments);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setTrackSegments(history[newIndex]);
          setSelectedSegmentIndex(null);
          setLockedSegmentIndex(null);
          setIsSelectionMode(false);
          setSelectionRange(null);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setTrackSegments(history[newIndex]);
          setSelectedSegmentIndex(null);
          setLockedSegmentIndex(null);
          setIsSelectionMode(false);
          setSelectionRange(null);
      }
  };

  // --- TRACK UPDATE LOGIC ---
  const handleTrackUpdate = (newImage) => {
      let targetSegIndex = -1;
      let start, end;

      if (selectionRange) {
          start = selectionRange.start;
          end = selectionRange.end;
          targetSegIndex = getSegmentIndexAtTime(start + 0.01);
      } else {
          if (lockedSegmentIndex !== null) {
              targetSegIndex = lockedSegmentIndex;
          } else if (selectedSegmentIndex !== null) {
              targetSegIndex = selectedSegmentIndex;
          } else {
              targetSegIndex = getSegmentIndexAtTime(currentTimeSecs);
          }

          if (targetSegIndex !== -1 && trackSegments[targetSegIndex]) {
              start = trackSegments[targetSegIndex].start;
              end = trackSegments[targetSegIndex].end;
          }
      }

      if (targetSegIndex === -1 || targetSegIndex >= trackSegments.length) return;
      
      const originalSeg = trackSegments[targetSegIndex];
      const TOLERANCE = 0.05;
      const newSegs = [...trackSegments];
      const replacements = [];

      if (start > originalSeg.start + TOLERANCE) {
          replacements.push({ ...originalSeg, end: start });
      }

      replacements.push({ type: 'image', img: newImage, start, end });

      if (end < originalSeg.end - TOLERANCE) {
          replacements.push({ ...originalSeg, start: end });
      }

      newSegs.splice(targetSegIndex, 1, ...replacements);
      addToHistory(newSegs);

      setSelectionRange(null);
      setIsPerspectiveOpen(false);
      
      const addedLeft = start > originalSeg.start + TOLERANCE;
      const newIndex = addedLeft ? targetSegIndex + 1 : targetSegIndex;
      
      setSelectedSegmentIndex(newIndex);
      setLockedSegmentIndex(null); 
      setIsSelectionMode(false); 
  };

  // --- MOUSE HANDLERS ---
  const getTimeFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    return Math.max(0, offsetX / pixelsPerSecond);
  };

  const handleMouseDown = (e) => {
    e.stopPropagation(); 
    const time = getTimeFromEvent(e);
    setDragStart(time);
    setDragCurrent(time);
    
    const clickedIndex = getSegmentIndexAtTime(time);
    setSelectedSegmentIndex(clickedIndex);
    
    if (isSelectionMode) {
        setLockedSegmentIndex(clickedIndex);
    }

    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTimeSecs(time);
    setActivePopupId(null); 
    setIsPerspectiveOpen(false);
  };

  const handleMouseMove = (e) => {
    if (dragStart !== null) {
      let time = getTimeFromEvent(e);
      
      if (isSelectionMode && lockedSegmentIndex !== null) {
          const seg = trackSegments[lockedSegmentIndex];
          if (seg) {
             time = Math.max(seg.start, Math.min(seg.end - 0.01, time));
          }
      }

      setDragCurrent(time);
      if (videoRef.current) videoRef.current.currentTime = time;
      setCurrentTimeSecs(time);
    }
  };

  const handleMouseUp = (e) => {
    if (dragStart !== null) {
      if (Math.abs(dragCurrent - dragStart) > 0.1) {
        if (isSelectionMode) {
            const start = Math.min(dragStart, dragCurrent);
            const end = Math.max(dragStart, dragCurrent);
            setSelectionRange({ start, end });
        }
      } 
      setDragStart(null);
      setDragCurrent(null);
    }
  };

  const handleTrackClick = (e) => {
    e.stopPropagation(); 
  };

  const getPlayheadColor = () => {
    if (isSelectionMode) return 'bg-lightning-yellow';
    return 'bg-alabaster';
  };

  // --- BUTTON STATE LOGIC ---
  const getBtnState = (btnId) => {
    const hasSelection = selectionRange !== null;

    if (btnId === 'undo') return historyIndex > 0 ? 2 : 1;
    if (btnId === 'redo') return historyIndex < history.length - 1 ? 2 : 1;

    if (btnId === 'add' || btnId === 'chevron') return 2; 

    if (btnId === 'extend') {
       if (isExtendMode) return 2;
       return selectedSegmentIndex !== null ? 2 : 1;
    }

    if (btnId === 'select') {
       if (hasSelection) return 3; 
       if (isSelectionMode) return 3; 
       return selectedSegmentIndex !== null ? 2 : 1; 
    }

    if (btnId === 'trim') {
        if (hasSelection) return 3;
        if (selectedSegmentIndex !== null) return 2;
        const isAtStart = currentTimeSecs < 0.1;
        const isAtEnd = Math.abs(currentTimeSecs - durationSecs) < 0.1;
        if (!isAtStart && !isAtEnd) return 2;
        return 1;
    }

    if (['remix', 'perspective', 'remove', 'template', 'export'].includes(btnId)) {
        if (hasSelection) return 3;
        if (selectedSegmentIndex !== null) return 2;
        return 1;
    }

    if (btnId === 'trash') {
        if (selectedSegmentIndex !== null) return 2;
        return 1;
    }

    return 1;
  };

  // --- POPUP CONTENT ---
  const getPopupContent = (btnId) => {
    const state = getBtnState(btnId);
    if (state === 1) return null;

    switch (btnId) {
        case 'undo': return "Undo Action";
        case 'redo': return "Redo Action";
        case 'extend':
            if (state === 2) return "This button has the same function as the extend function available.";
            break;
        case 'remix':
            if (state === 2) return " This button has the same function as the remix function available.";
            if (state === 3) return " This button has the same function as the remix function available, but it applies only to the highlighted section";
            break;
        case 'remove':
            if (state === 2) return " This button will help adjust scenes by removing objects. The viability will depend on model capabilities.";
            if (state === 3) return " This button will help adjust scenes by removing objects. The viability will depend on model capabilities, but for the highlighted section.";
            break;
        case 'template':
            if (state === 2) return "This button will have the apply template effect. With current limitations, only the video templates will be available. We can use the character in the selected clip as the reference image for the template.";
            if (state === 3) return "Same but for the highlighted section.";
            break;
        case 'trim':
            if (state === 2) return "This has the same function as the cut button, splitting the video where the player head is.";
            if (state === 3) return "When highlighted, pressing this button will remove the highlighted section of the selected video entirely.";
            break;
        case 'trash':
            if (state === 2) return "Delete selected video";
            break;
        case 'add':
            if (state === 2) return "The Add Media button is moved from the left side of the bottom section to here.";
            break;
        case 'export':
            if (state === 2) return "Export selected video.";
            if (state === 3) return "Export selected clip.";
            break;
        default:
            return null;
    }
  };

  // --- HANDLERS ---
  const handleChevronClick = (e) => {
    e.stopPropagation();
    setIsToolboxCollapsed(prev => !prev);
  };

  const handleButtonClick = (e, btnId) => {
    e.stopPropagation();

    if (btnId === 'perspective') {
        const rect = e.currentTarget.getBoundingClientRect();
        const bottomPos = window.innerHeight - rect.top + 12; 
        setPerspectivePos({
            bottom: bottomPos,
            left: rect.left + (rect.width / 2) - (338 / 2)
        });
        if (getBtnState('perspective') >= 2) setIsPerspectiveOpen(!isPerspectiveOpen);
        setActivePopupId(null); 
        return;
    }

    if (btnId === 'undo') {
        handleUndo();
        return;
    }
    if (btnId === 'redo') {
        handleRedo();
        return;
    }

    const popupText = getPopupContent(btnId);
    if (popupText) {
        setActivePopupId(activePopupId === btnId ? null : btnId);
        setIsPerspectiveOpen(false);
    } else {
        setActivePopupId(null);
    }

    if (btnId === 'extend') {
        if (getBtnState('extend') >= 2) setIsExtendMode(!isExtendMode);
    }
    if (btnId === 'select') {
        if (getBtnState('select') >= 2) {
            const newMode = !isSelectionMode;
            setIsSelectionMode(newMode);
            
            if (newMode) {
                const idx = getSegmentIndexAtTime(currentTimeSecs);
                setLockedSegmentIndex(idx);
            } else {
                setSelectionRange(null);
                setLockedSegmentIndex(null);
            }
        }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">

      {/* --- PERSPECTIVE TOOL --- */}
      {isPerspectiveOpen && (
        <PerspectiveTool 
            style={{ 
                bottom: `${perspectivePos.bottom}px`, 
                left: `${perspectivePos.left}px` 
            }} 
            onClose={() => setIsPerspectiveOpen(false)}
            onUpdateTrack={handleTrackUpdate}
            toolboxHeight={toolboxHeight}
            toolboxLeft={toolboxLeft} // PASS LEFT ALIGNMENT
        />
      )}

      {/* --- 1. VIDEO CONTAINER --- */}
      <div 
        onClick={handleResetState} 
        className="w-full mb-[4px] relative transition-all duration-300 ease-in-out overflow-hidden"
        style={{ flex: '1 1 0%' }}
      >
        <div className="w-full h-full p-[16px] flex items-center justify-center">
          <div className="aspect-video w-full h-full flex items-center justify-center relative overflow-hidden group">
            <video 
              ref={videoRef}
              src={videoSrc}
              className="max-w-full max-h-full w-auto h-auto object-contain border border-shark-light rounded-lg shadow-sm"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay} 
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        </div>
      </div>

      {/* --- 2. TOOLBOX CONTAINER --- */}
      <div 
        ref={toolboxRef}
        onMouseDown={(e) => e.stopPropagation()} 
        className="mx-[4px] mb-[4px] bg-woodsmoke-light rounded-t-[5px] flex flex-col transition-all duration-300 ease-in-out border-t border-x border-shark-light self-center overflow-hidden"
        style={{ 
            width: 'calc(100% - 8px)',
            flex: isToolboxCollapsed ? '0 0 110px' : '0 0 380px' 
        }}
      >
        
        {/* A. HEADER */}
        <div className="w-full h-[42px] shrink-0 flex items-center bg-woodsmoke-light border-b border-shark-light px-[5px] z-20 relative">
          <div className="flex items-center gap-[5px] h-full">
            <CustomButton state={getBtnState('undo')} Icon={IconUndo} onClick={(e) => handleButtonClick(e, 'undo')} tooltip={getPopupContent('undo')} isActivePopup={activePopupId === 'undo'} />
            <CustomButton state={getBtnState('redo')} Icon={IconRedo} onClick={(e) => handleButtonClick(e, 'redo')} tooltip={getPopupContent('redo')} isActivePopup={activePopupId === 'redo'} />
            
            <CustomButton 
                state={getBtnState('extend')} 
                width={74} 
                onClick={(e) => handleButtonClick(e, 'extend')}
                popupText={getPopupContent('extend')}
                isActivePopup={activePopupId === 'extend'}
            >
                <div className="flex items-center justify-center text-current">
                    <IconExtend /><div className="w-[1px]" />
                    <span className="font-geist font-medium text-[14px] leading-[19.6px]">Extend</span>
                </div>
            </CustomButton>

            <CustomButton 
                state={getBtnState('select')} 
                width={121}
                onClick={(e) => handleButtonClick(e, 'select')}
                popupText={getPopupContent('select')}
                isActivePopup={activePopupId === 'select'}
            >
                <div className="flex items-center justify-center text-current">
                    <IconSelectClip /><div className="w-[10px]" />
                    <span className="font-geist font-medium text-[14px] leading-[19.6px]">
                        {selectionRange ? 'Deselect Clip' : 'Select Clip'}
                    </span>
                </div>
            </CustomButton>

            <CustomButton 
                state={getBtnState('remix')} 
                Icon={IconRemix} 
                onClick={(e) => handleButtonClick(e, 'remix')} 
                popupText={getPopupContent('remix')}
                isActivePopup={activePopupId === 'remix'}
            />
            
            <CustomButton 
                state={getBtnState('perspective')} 
                Icon={IconPerspective} 
                onClick={(e) => handleButtonClick(e, 'perspective')} 
            />

            <CustomButton 
                state={getBtnState('remove')} 
                Icon={IconRemoveObject} 
                onClick={(e) => handleButtonClick(e, 'remove')} 
                popupText={getPopupContent('remove')}
                isActivePopup={activePopupId === 'remove'}
            />
            <CustomButton 
                state={getBtnState('template')} 
                Icon={IconApplyTemplate} 
                onClick={(e) => handleButtonClick(e, 'template')} 
                popupText={getPopupContent('template')}
                isActivePopup={activePopupId === 'template'}
            />
            <CustomButton 
                state={getBtnState('trim')} 
                Icon={IconTrim} 
                onClick={(e) => handleButtonClick(e, 'trim')} 
                popupText={getPopupContent('trim')}
                isActivePopup={activePopupId === 'trim'}
            />
            
            <CustomButton 
                state={getBtnState('trash')} 
                Icon={IconTrash} 
                iconColor={getBtnState('trash') === 2 ? 'text-amaranth' : undefined} 
                onClick={(e) => handleButtonClick(e, 'trash')}
                popupText={getPopupContent('trash')}
                isActivePopup={activePopupId === 'trash'}
            />
          </div>

          <div className="ml-auto flex items-center gap-[5px] h-full">
             <CustomButton 
                state={getBtnState('add')} 
                width={121} 
                onClick={(e) => handleButtonClick(e, 'add')}
                popupText={getPopupContent('add')}
                isActivePopup={activePopupId === 'add'}
             >
                <div className="flex items-center justify-center text-current">
                   <IconAdd /><div className="w-[6px]" />
                   <span className="font-geist font-medium text-[14px] leading-[19.6px]">Add Media</span>
                </div>
             </CustomButton>
             
             <CustomButton 
                state={getBtnState('export')} 
                Icon={IconExport} 
                onClick={(e) => handleButtonClick(e, 'export')}
                popupText={getPopupContent('export')}
                isActivePopup={activePopupId === 'export'}
             />
             
             <CustomButton 
                state={getBtnState('chevron')} 
                onClick={handleChevronClick}
             >
                <div className={`transition-transform duration-300 ${isToolboxCollapsed ? 'rotate-180' : ''}`}>
                   <IconChevronDown />
                </div>
             </CustomButton>
          </div>
        </div>

        {/* B. TIMELINE CONTENT */}
        <div 
          ref={timelineContainerRef}
          className={`flex-1 w-full min-h-0 overflow-x-auto overflow-y-auto transition-opacity duration-200 relative bg-woodsmoke-light ${isToolboxCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
             <div 
                className="px-[20px] flex flex-col box-border cursor-pointer relative select-none"
                style={{ minWidth: '100%', width: `${totalTimelineWidth}px`, height: '100%' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
             >
                <div className="w-full flex flex-col justify-center min-h-[20px]" style={{ flex: '2 1 0%' }}>
                    <div className="h-0 w-full relative shrink-0 overflow-visible">
                        {Array.from({ length: Math.ceil((totalTimelineWidth / pixelsPerSecond) / rulerInterval) }).map((_, i) => {
                            const seconds = i * rulerInterval;
                            const leftPos = seconds * pixelsPerSecond;
                            if (leftPos > totalTimelineWidth) return null;
                            return (
                                <div key={i} className="absolute top-0 flex flex-row items-center pointer-events-none"
                                    style={{ left: `${leftPos}px`, transform: 'translateY(-50%)' }}>
                                    <div className="w-[4px] h-[4px] rounded-full bg-jumbo" />
                                    <div className="w-[4px]" />
                                    <span className="text-jumbo font-geistMono text-[13px] leading-[18.2px]">{seconds}s</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="shrink-0 flex flex-col relative">
                    {/* Playhead */}
                    <div className="absolute z-50 flex flex-col items-center pointer-events-none transition-all duration-75 ease-linear"
                        style={{ left: `${currentTimeSecs * pixelsPerSecond}px`, top: '-10px', bottom: '0px', transform: 'translateX(-50%)' }}>
                        <div className={`text-woodsmoke-dark rounded-[20px] px-2 py-0.5 flex items-center justify-center whitespace-nowrap shadow-sm mb-0.5 ${getPlayheadColor()}`}>
                            <span className="font-geistMono text-[11px] leading-[20px]">{currentTimeSecs.toFixed(1)}</span>
                        </div>
                        <div className={`w-[2px] flex-1 shadow-[0_0_4px_rgba(255,205,28,0.4)] ${getPlayheadColor()}`} />
                    </div>

                    <div className="h-[40px] w-full bg-woodsmoke-dark rounded-[12px] shrink-0" />
                    <div className="h-[4px] shrink-0" />
                    
                    {/* MIDDLE VIDEO TRACK CONTAINER */}
                    <div 
                        className="h-[80px] w-full bg-woodsmoke-dark rounded-[12px] shrink-0 flex items-center overflow-hidden transition-all duration-200 box-border relative"
                    >
                        {/* 1. Drag Highlight */}
                        {isSelectionMode && dragStart !== null && dragCurrent !== null && Math.abs(dragCurrent - dragStart) > 0.1 && (
                            <div className="absolute z-30 bg-lightning-yellow/20 pointer-events-none"
                                style={{
                                    left: `${Math.min(dragStart, dragCurrent) * pixelsPerSecond}px`,
                                    width: `${Math.abs(dragCurrent - dragStart) * pixelsPerSecond}px`,
                                    top: 0, bottom: 0, 
                                    borderRadius: '5px', borderWidth: '5px 10px 5px 10px', borderColor: '#FFCD1C'
                                }}
                            />
                        )}
                        {/* 2. Confirmed Range Highlight */}
                        {selectionRange && (
                            <div className="absolute z-30 bg-lightning-yellow/20 pointer-events-none"
                                style={{
                                    left: `${selectionRange.start * pixelsPerSecond}px`,
                                    width: `${(selectionRange.end - selectionRange.start) * pixelsPerSecond}px`,
                                    top: 0, bottom: 0,
                                    borderRadius: '5px', borderWidth: '5px 10px 5px 10px', borderColor: '#FFCD1C'
                                }}
                            />
                        )}

                        {/* 3. Track Segments List */}
                        <div className="flex h-full gap-[4px]">
                            {trackSegments.map((seg, i) => {
                                const segWidth = Math.max(0, (seg.end - seg.start) * pixelsPerSecond);
                                if (segWidth < 1) return null;

                                let borderClass = '';
                                if (isSelectionMode) {
                                    if (lockedSegmentIndex === i) {
                                        borderClass = 'border border-lightning-yellow';
                                    }
                                } else {
                                    if (selectedSegmentIndex === i) {
                                        borderClass = 'border border-alabaster';
                                    }
                                }

                                return (
                                    <div 
                                        key={i}
                                        className={`h-full relative overflow-hidden rounded-[12px] shrink-0 box-border ${borderClass}`}
                                        style={{ width: `${segWidth}px` }}
                                    >
                                        {seg.type === 'video' ? (
                                            <div className="flex h-full w-full"> 
                                                {/* Calculate needed thumbnails for this specific width */}
                                                {Array.from({ length: Math.ceil(segWidth / 144) + 1 }).map((_, k) => (
                                                    <div key={k} className="w-[144px] h-full border-r border-black/20 shrink-0 relative bg-black">
                                                        <video src={videoSrc} className="w-full h-full object-cover opacity-60 pointer-events-none" muted />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex h-full w-full"> 
                                                {Array.from({ length: Math.ceil(segWidth / 144) + 1 }).map((_, k) => (
                                                    <div key={k} className="w-[144px] h-full border-r border-black/20 shrink-0 relative bg-black">
                                                        <img src={seg.img} className="w-full h-full object-cover pointer-events-none" alt="" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Plus Button inside Flex Container */}
                            <div className="h-full aspect-square rounded-[12px] border border-shark-light bg-black flex items-center justify-center cursor-pointer hover:bg-shark-light transition-colors shrink-0">
                                <div className="text-iron-dark"><IconPlusLarge /></div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[4px] shrink-0" />
                    <div className="h-[40px] w-full bg-woodsmoke-dark rounded-[12px] shrink-0 cursor-pointer hover:bg-woodsmoke-dark/80 transition-colors relative">
                        <div className="absolute top-0 h-full flex items-center justify-center pointer-events-none" style={{ width: `${containerWidth}px`, position: 'sticky', left: 0 }}>
                            <div className="pointer-events-auto flex items-center">
                                <div className="text-santasGray flex items-center"><IconPlusSmall /></div>
                                <div className="w-[7px]" />
                                <span className="font-geist text-reg-14 text-santasGray">Click to add audio layer</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full min-h-[20px]" style={{ flex: '1 1 0%' }} />
             </div>
        </div>

        {/* C. PLAYER */}
        <div className="w-full h-[68px] shrink-0 border-t border-shark-light flex items-center relative px-6 bg-woodsmoke-light z-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-[24px]">
            <span className="text-med-14 text-alabaster w-[40px] text-right font-geistMono">{formatTime(currentTimeSecs)}</span>
            <div className="flex items-center gap-[16px]">
              <button className="text-icon-base hover:text-white transition-colors"><IconRewind /></button>
              <button onClick={togglePlay} className="w-[32px] h-[32px] bg-alabaster rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>
              <button className="text-icon-base hover:text-white transition-colors"><IconFastForward /></button>
            </div>
            <span className="text-med-14 text-paleSky w-[40px] font-geistMono">{formatTime(durationSecs)}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setZoomLevel(Math.max(0, zoomLevel - 10))}><IconMinus /></button>
            <div className="w-[100px] h-[24px] flex items-center relative group">
                <div className="w-full h-[2px] bg-shark-light rounded-full"></div>
                <input type="range" min="0" max="100" value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="absolute w-[12px] h-[12px] bg-alabaster rounded-full shadow-sm pointer-events-none transition-all duration-75" style={{ left: `${zoomLevel}%`, transform: 'translateX(-50%)' }} />
            </div>
            <button onClick={() => setZoomLevel(Math.min(100, zoomLevel + 10))}><IconPlusSmall /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- BUTTON COMPONENT ---
const CustomButton = ({ state, width = 32, Icon, children, onClick, iconColor, popupText, isActivePopup }) => {
  const buttonRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isActivePopup && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPopupPos({
            top: rect.top - 12, 
            left: rect.left + (rect.width / 2)
        });
    }
  }, [isActivePopup]);

  let styles = {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    opacity: 1,
    color: 'inherit'
  };

  if (state === 1) {
    styles.backgroundColor = 'rgba(24, 24, 27, 0.8)';
    styles.boxShadow = SHADOW_STATE_1;
    styles.color = '#D4D4D8';
  } else if (state === 2) {
    styles.backgroundColor = '#29292E';
    styles.boxShadow = SHADOW_STATE_2_3;
    styles.color = '#D4D4D8';
  } else if (state === 3) {
    styles.backgroundColor = '#FFCD1C'; 
    styles.boxShadow = SHADOW_STATE_2_3;
    styles.color = '#29292E';
  }

  return (
    <div ref={buttonRef} className="relative flex flex-col items-center">
        {isActivePopup && popupText && (
            <div 
                className="fixed z-[9999] bg-woodsmoke-light border border-shark-light rounded-[4px] p-[10px] box-border"
                style={{
                    top: popupPos.top,
                    left: popupPos.left,
                    width: '154px',
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none' 
                }}
            >
                <p className="font-geist font-normal text-[14px] leading-[21px] text-iron-dark text-left whitespace-normal">
                    {popupText}
                </p>
                <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-woodsmoke-light border-r border-b border-shark-light rotate-45"></div>
            </div>
        )}

        <button 
            onClick={onClick} 
            style={{ width: `${width}px`, ...styles }} 
            className={`h-[32px] rounded flex items-center justify-center transition-all duration-200 ${iconColor || ''}`}
        >
        {Icon ? <Icon /> : children}
        </button>
    </div>
  );
};