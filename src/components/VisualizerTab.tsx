"use client";

import React, { useState } from 'react';
import { Sparkles, Upload, HelpCircle, Save, ChevronRight, CheckCircle2 } from 'lucide-react';

interface VisualizerTabProps {
  serverUrl: string;
  onProjectSaved: () => void;
}

const STYLES = [
  { id: 'scandinavian', name: 'Scandinavian', desc: 'Light woods, warm textures, cozy minimalism', bg: 'from-amber-100 to-orange-100 text-gray-800' },
  { id: 'industrial', name: 'Industrial', desc: 'Raw concrete, exposed brick, dark metal structures', bg: 'from-stone-600 to-zinc-800 text-white' },
  { id: 'bohemian', name: 'Bohemian', desc: 'Lush greenery, rich fabrics, natural materials', bg: 'from-emerald-800 to-amber-700 text-white' },
  { id: 'japandi', name: 'Japandi', desc: 'Japanese wabi-sabi meets modern Nordic warmth', bg: 'from-amber-50/10 to-stone-200/20 text-gray-200' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Sleek surfaces, hidden storage, monochromatic', bg: 'from-zinc-900 via-neutral-800 to-stone-900 text-white' },
];

const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Home Office'
];

export default function VisualizerTab({ serverUrl, onProjectSaved }: VisualizerTabProps) {
  // Input states
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  // Processing states
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [result, setResult] = useState<{
    imageUrl: string;
    style: string;
    roomType: string;
    promptUsed: string;
  } | null>(null);

  // Saving states
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock upload interaction
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Generation
  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setSaveSuccess(false);
    setProjectName('');

    // Simulated status updates
    const steps = [
      'Scanning room blueprint structure...',
      'Synthesizing structural lighting anchors...',
      'Injecting material style templates...',
      'Refining photorealistic shadows...'
    ];

    let currentStep = 0;
    setStatusStep(steps[currentStep]);
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setStatusStep(steps[currentStep]);
      }
    }, 600);

    try {
      const response = await fetch(`${serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: selectedStyle,
          roomType: selectedRoom,
          customPrompt,
          image: roomImage
        })
      });
      const data = await response.json();
      
      clearInterval(interval);
      if (data.success) {
        setResult({
          imageUrl: data.imageUrl,
          style: data.style,
          roomType: data.roomType,
          promptUsed: data.promptUsed
        });
      } else {
        alert(data.error?.message || 'Failed to generate visual.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to API node.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Save project to Gallery
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !result) return;

    setSaving(true);
    try {
      const response = await fetch(`${serverUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          roomType: result.roomType,
          style: result.style,
          imageUrl: result.imageUrl,
          prompt: result.promptUsed
        })
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
        onProjectSaved(); // Notify parent to refresh lists
      } else {
        alert(data.error?.message || 'Failed to save project.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold tracking-wide">Design Settings</h2>
          </div>

          {/* Room Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Room Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_TYPES.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => setSelectedRoom(room)}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all ${
                    selectedRoom === room
                      ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                      : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Design Style</label>
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                    selectedStyle === style.id
                      ? 'border-violet-500/50 bg-violet-950/20 text-white'
                      : 'border-white/5 bg-white/[0.01] text-gray-400 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedStyle === style.id ? 'text-violet-300' : 'text-gray-300'}`}>
                      {style.name}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-normal font-normal">
                      {style.desc}
                    </span>
                  </div>
                  <div className={`hidden sm:block text-[9px] px-2 py-0.5 rounded font-bold uppercase ${style.bg}`}>
                    Preview
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Component */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source Room Blueprint (Optional)</label>
            <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-cyan-500/40 bg-white/[0.01] hover:bg-cyan-950/5 rounded-xl p-5 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 mb-2 transition-colors" />
              {fileName ? (
                <div className="text-center">
                  <p className="text-[11px] font-medium text-cyan-300 truncate max-w-[200px]">{fileName}</p>
                  <p className="text-[9px] text-gray-500">Click or drag to replace</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[11px] font-semibold text-gray-300">Upload Room Image</p>
                  <p className="text-[9px] text-gray-500">Supports PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Instruction Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              Custom Prompt Instructions
              <span className="group relative">
                <HelpCircle className="w-3.5 h-3.5 text-gray-500 cursor-pointer" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded bg-black border border-white/10 text-[9px] text-gray-400 leading-normal pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  Instruct the AI on lighting levels, accent items, layouts, window scenes, etc.
                </span>
              </span>
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Add an accent wall in deep olive, large plants, ambient sunset light streaming through floor-to-ceiling windows..."
              className="w-full min-h-[70px] bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
            />
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="btn-gradient w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Synthesizing Space...' : 'Generate AI Interior'}
          </button>
        </div>
      </div>

      {/* Visual Workspace Screen */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl min-h-[450px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Active Process / Idle States */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
              <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-violet-400 border-b-transparent border-l-transparent animate-spin" />
              <div className="text-center px-4 animate-pulse">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{statusStep}</p>
                <p className="text-[10px] text-gray-500 mt-1">This will take a few seconds...</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-300 mb-1">Canvas Ready for Generation</h3>
              <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
                Configure your design settings on the left, then click the generate button to view render.
              </p>
            </div>
          )}

          {/* Results Showcase */}
          {result && !loading && (
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Synthesized Visual</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Rendered at high fidelity</p>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">
                  {result.style}
                </div>
              </div>

              {/* Generated Image Frame */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt="Generated AI room style"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Prompt summary info */}
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Architectural Prompt</span>
                <p className="text-xs text-gray-300 italic font-medium leading-relaxed">
                  "{result.promptUsed}"
                </p>
              </div>

              {/* Save Project Actions */}
              <div className="border-t border-white/5 pt-4 mt-auto">
                {saveSuccess ? (
                  <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Project Synced Successfully!</p>
                      <p className="text-[10px] text-emerald-500/70">It is now visible in the Gallery tab.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Name this space (e.g. My Dream Study, Cozy Living Area)..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Syncing...' : 'Save to Gallery'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
