"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FolderHeart, Trash2, Calendar, Eye, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  roomType: string;
  style: string;
  imageUrl: string;
  prompt?: string;
  createdAt: string;
}

interface GalleryTabProps {
  serverUrl: string;
  refreshTrigger: number;
}

export default function GalleryTab({ serverUrl, refreshTrigger }: GalleryTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Fetch projects from server
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/projects`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to load gallery projects:', err);
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, refreshTrigger]);

  // Delete project
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this project?')) return;

    try {
      const response = await fetch(`${serverUrl}/api/projects/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p.id !== id));
        if (activeProject?.id === id) {
          setActiveProject(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Detail Overlay Modal */}
      {activeProject && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity">
          <div
            className="glass-panel w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black text-gray-400 hover:text-white text-sm transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-square bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeProject.imageUrl}
                  alt={activeProject.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Saved Space</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{activeProject.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Room Type</span>
                      <p className="text-xs text-gray-200 font-medium">{activeProject.roomType}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Applied Style</span>
                      <p className="text-xs text-gray-200 font-medium capitalize">{activeProject.style}</p>
                    </div>
                  </div>

                  {activeProject.prompt && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Synthesis Prompt</span>
                      <p className="text-xs text-gray-300 italic bg-black/20 p-3 rounded-lg border border-white/5">
                        "{activeProject.prompt}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(activeProject.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      handleDelete(e, activeProject.id);
                    }}
                    className="text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Section Layout */}
      {/* <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-gray-300">Design Portfolio</h2>
          <p className="text-[10px] text-gray-500 font-medium">Browse and manage your synthesized spaces</p>
        </div>
      </div> */}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel rounded-2xl overflow-hidden aspect-[4/3] skeleton-pulse bg-white/[0.01]" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
            <FolderHeart className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-300 mb-1">Your Portfolio is Empty</h3>
          <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
            Create room render ideas in the **Visualizer** tab and save them to construct your catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col cursor-pointer group relative shadow-lg"
            >
              {/* Image viewport */}
              <div className="relative aspect-[4/3] w-full bg-black overflow-hidden border-b border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="w-9 h-9 rounded-full bg-rose-950/40 border border-rose-500/20 backdrop-blur flex items-center justify-center text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text content details */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-gray-500 font-semibold">{project.roomType}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-[9px] text-violet-400 font-semibold uppercase tracking-wider capitalize">
                      {project.style}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[9px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-0.5 text-cyan-400">
                    <Sparkles className="w-2.5 h-2.5" />
                    Synthesized
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
