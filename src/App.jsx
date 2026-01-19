// App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import TopMenu from './components/TopMenu';
import EditorWorkspace from './components/EditorWorkspace'; // Import the new file

export default function App() {
  return (
    <div className="flex h-screen bg-black overflow-hidden font-geist">
      
      {/* LEFT: Sidebar */}
      <Sidebar />
      
      {/* MIDDLE: Main Content Area (TopMenu + Workspace) */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0">
        <TopMenu />
        <EditorWorkspace />
      </div>
      
    </div>
  );
}