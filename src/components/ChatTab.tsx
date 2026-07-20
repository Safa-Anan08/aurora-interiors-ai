"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  Palette,
  BrainCircuit,
  BadgeDollarSign,
  Loader2,
  Send, Sparkles, User, CheckCircle2, Circle, AlertCircle,
  ShoppingCart, RefreshCw, Sliders, FileText, ArrowRight, Home, Info
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'furniture' | 'lighting' | 'flooring' | 'paint' | 'decor';
  price: number;
  description: string;
  image: string;
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
}

interface DesignBoard {
  title: string;
  summary: string;
  completePlan: string;
  recommendedFurniture: string[];
  wallColors: { name: string; hex: string }[];
  floorTiles: string;
  ceilingDetails: string;
  lightingSuggestions: string;
  curtains: string;
  decorations: string;
  spacePlanning: string;
  furnitureSizes: string;
  walkingClearances: string;
  estimatedBudgetBreakdown: string;
  shoppingCatalog: Product[];
  imageUrl: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  board?: DesignBoard;
}

interface DesignerState {
  propertyType?: string;
  sqFt?: string;
  bedrooms?: string;
  familyMembers?: string;
  kids?: string;
  pets?: string;
  budget?: string;
  style?: string;
  colors?: string;
  lighting?: string;
  flooring?: string;
  ceiling?: string;
  furnitureNeeds?: string;
  storage?: string;
  naturalLight?: string;
}

interface ChatTabProps {
  serverUrl: string;
}

// Custom Markdown-like Renderer for Chat Content
function renderMessageContent(content: string) {
  return content.split('\n').map((line, idx) => {
    let cleanLine = line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="text-dusty-rose font-bold">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }
    const renderedLine = parts.length > 0 ? parts : cleanLine;

    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-charcoal-light dark:text-gray-300 text-xs my-1 leading-relaxed">
          {typeof renderedLine === 'string' ? line.substring(2) : renderedLine}
        </li>
      );
    }

    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={idx} className="ml-4 list-decimal text-charcoal-light dark:text-gray-300 text-xs my-1 leading-relaxed">
          {numMatch[2]}
        </li>
      );
    }

    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-sm font-bold text-charcoal dark:text-white mt-4 mb-2 uppercase tracking-wide border-b border-lavender-grey/30 dark:border-white/5 pb-1">
          {line.substring(4)}
        </h4>
      );
    }
    if (line.startsWith('#### ')) {
      return (
        <h5 key={idx} className="text-xs font-bold text-dusty-rose mt-3 mb-1 uppercase">
          {line.substring(5)}
        </h5>
      );
    }

    return (
      <p key={idx} className="text-xs leading-relaxed text-charcoal-light dark:text-gray-300 my-1.5 min-h-[1em]">
        {renderedLine}
      </p>
    );
  });
}

export default function ChatTab({ serverUrl }: ChatTabProps) {
  const { addToCart, addBundleToCart } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to your virtual interior design studio. Let's begin planning your space!\n\n**House or Apartment?**"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "House",
    "Apartment",
    "Townhouse"
  ]);

  // Live parsed state from AI memory
  const [aiState, setAiState] = useState<DesignerState>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  // Custom states for user interactions
  const [refineText, setRefineText] = useState('');
  const [reasoningLogs, setReasoningLogs] = useState<string[]>([
    '[INIT] Designer agent initialized.',
    '[GOAL] Commencing guided homeowner consultation.'
  ]);
  const [synthesisStep, setSynthesisStep] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Derive logs from state variables
  useEffect(() => {
    const logs: string[] = ['[INIT] Designer agent initialized.'];
    if (aiState.propertyType) logs.push(`[STATE] Target structure identified: ${aiState.propertyType}`);
    if (aiState.sqFt) logs.push(`[STATE] Square footage parsed: ${aiState.sqFt}`);
    if (aiState.bedrooms) logs.push(`[STATE] Room partition count: ${aiState.bedrooms}`);
    if (aiState.familyMembers) logs.push(`[STATE] Occupancy load: ${aiState.familyMembers} members`);

    if (aiState.kids) {
      const hasKids = aiState.kids.toLowerCase().includes('yes') || aiState.kids.toLowerCase().includes('have');
      logs.push(hasKids
        ? `[RULE] Kid safety constraints activated. Prioritizing soft corners & durable fabrics.`
        : `[RULE] Standard structural clearance profiles.`
      );
    }
    if (aiState.pets) {
      const hasPets = aiState.pets.toLowerCase().includes('yes') || aiState.pets.toLowerCase().includes('have');
      logs.push(hasPets
        ? `[RULE] Pet durability protocols activated. Recommending anti-scratch textures.`
        : `[RULE] Zero claw-wear modifications.`
      );
    }
    if (aiState.budget) logs.push(`[STATE] Financial ceiling defined: ${aiState.budget}`);
    if (aiState.style) logs.push(`[STATE] Aesthetic benchmark selected: ${aiState.style}`);
    if (aiState.colors) logs.push(`[STATE] Priming color coordinates: ${aiState.colors}`);
    if (aiState.lighting) logs.push(`[STATE] Illuminance scheme matched: ${aiState.lighting}`);
    if (aiState.flooring) logs.push(`[STATE] Flooring texture bound: ${aiState.flooring}`);
    if (aiState.ceiling) logs.push(`[STATE] Ceiling topography set: ${aiState.ceiling}`);
    if (aiState.furnitureNeeds) logs.push(`[STATE] Catalog lists parsed: ${aiState.furnitureNeeds}`);
    if (aiState.storage) logs.push(`[STATE] Storage configuration cataloged: ${aiState.storage}`);
    if (aiState.naturalLight) logs.push(`[STATE] Skylight & Solar radiation level: ${aiState.naturalLight}`);

    // If ready, suggest layout compile
    const filledCount = Object.values(aiState).filter(Boolean).length;
    if (filledCount >= 15) {
      logs.push(`[READY] All 15 points mapped. Ready for complete spatial synthesis.`);
    }

    setReasoningLogs(logs);
  }, [aiState]);

  // Send message API endpoint
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Simulate agent typing thoughts
    setSynthesisStep('Extracting key entities...');
    const stepTimers = [
      setTimeout(() => setSynthesisStep('Matching spatial parameters...'), 400),
      setTimeout(() => setSynthesisStep('Updating design memory matrix...'), 800),
      setTimeout(() => setSynthesisStep('Formulating next questionnaire node...'), 1200)
    ];

    try {
      const response = await fetch(`${serverUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();

      stepTimers.forEach(clearTimeout);
      setSynthesisStep('');

      if (data.success) {
        setMessages([...newMessages, data.message]);
        if (data.state) {
          setAiState(data.state);
        }
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: "Failed to parse consultation details. Please retry." }
        ]);
      }
    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setSynthesisStep('');
      console.error(err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Assistant node offline. Verify backend connection." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Regeneration of Proposal
  const handleRegenerate = () => {
    sendMessage("Regenerate alternative design proposal based on my profile.");
  };

  // Refinement of Proposal
  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    sendMessage(`Refinement: ${refineText}`);
    setRefineText('');
  };

  // Add individual recommendation product
  const handleAddProduct = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category
    });
    setAddedItemMap(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [p.id]: false }));
    }, 1200);
  };

  // Add entire bundle proposal to cart
  const handleAddBundle = (products: Product[]) => {
    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category
    }));
    addBundleToCart(formatted);
    alert('🛍️ Complete design board bundle added to shopping cart!');
  };

  // PDF Export using Print Window
  const handleExportPDF = (board: DesignBoard) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow popups for PDF export.');
      return;
    }

    const colorsHtml = board.wallColors.map(c => `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <div style="width: 28px; height: 28px; border-radius: 4px; background-color: ${c.hex}; border: 1px solid #ddd;"></div>
        <div>
          <div style="font-size: 11px; font-weight: bold; color: #111;">${c.name}</div>
          <div style="font-size: 9px; color: #666; font-family: monospace;">${c.hex}</div>
        </div>
      </div>
    `).join('');

    const productsHtml = board.shoppingCatalog.map(p => `
      <div style="display: flex; gap: 12px; padding: 10px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 8px; page-break-inside: avoid;">
        <img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-cover: cover; border-radius: 4px;" />
        <div style="flex: 1;">
          <h4 style="margin: 0; font-size: 11px; color: #222;">${p.name}</h4>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #0284c7; font-weight: bold;">$${p.price}</p>
        </div>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Aurora Interiors AI - Design Report</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 40px;
          }
          .header {
            border-bottom: 2px solid #0891b2;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            color: #111;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .subtitle {
            font-size: 11px;
            color: #0891b2;
            font-weight: 700;
            margin: 4px 0 0 0;
            text-transform: uppercase;
          }
          .summary {
            font-style: italic;
            color: #555;
            font-size: 11px;
            margin-bottom: 20px;
            padding: 10px;
            background: #f8fafc;
            border-left: 3px solid #cbd5e1;
          }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-top: 25px;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          p, li {
            font-size: 11px;
            color: #475569;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          .grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
          }
          .col {
            min-width: 0;
          }
          .list-block {
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 10px;
            color: #334155;
            white-space: pre-line;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${board.title}</h1>
          <div class="subtitle">Aurora Interiors AI Designer Studio Report</div>
        </div>

        <div class="summary">"${board.summary}"</div>

        <div class="section-title">1. Complete Interior Design Plan</div>
        <div style="font-size:11px;">
          ${board.completePlan.replace(/###/g, '').replace(/####/g, '').split('\n').map(l => `<p>${l}</p>`).join('')}
        </div>

        <div class="grid" style="margin-top:20px;">
          <div class="col">
            <div class="section-title">2. Recommended Furniture Specs</div>
            <ul>
              ${board.recommendedFurniture.map(f => `<li>${f}</li>`).join('')}
            </ul>

            <div class="section-title">3. Matching Wall Colors</div>
            <div style="margin-top:8px;">${colorsHtml}</div>

            <div class="section-title">4. Matching Floor Tiles</div>
            <p>${board.floorTiles}</p>

            <div class="section-title">5. Matching Ceiling</div>
            <p>${board.ceilingDetails}</p>

            <div class="section-title">6. Lighting Suggestions</div>
            <div class="list-block">${board.lightingSuggestions}</div>
          </div>

          <div class="col">
            <div class="section-title">7. Curtains & Drapery</div>
            <p>${board.curtains}</p>

            <div class="section-title">8. Decorations & Art</div>
            <p>${board.decorations}</p>

            <div class="section-title">9. Space Planning Rationale</div>
            <p>${board.spacePlanning}</p>

            <div class="section-title">10. Target Furniture Sizes</div>
            <div class="list-block">${board.furnitureSizes}</div>

            <div class="section-title">11. Walking clearances</div>
            <div class="list-block">${board.walkingClearances}</div>

            <div class="section-title">12. Estimated Budget Breakdown</div>
            <div class="list-block">${board.estimatedBudgetBreakdown}</div>
          </div>
        </div>

        <div class="section-title" style="page-break-before: always;">13. Catalog Shopping Recommendations</div>
        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 15px; margin-top: 10px;">
          ${productsHtml}
        </div>

        <div class="footer">
          Generated via Aurora Interiors AI Engine. Copyright © 2026. All rights reserved.
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Completion calculation for progress bar
  const checklist = [
    { key: 'propertyType', label: 'Property Type', val: aiState.propertyType },
    { key: 'sqFt', label: 'Total Area', val: aiState.sqFt },
    { key: 'bedrooms', label: 'Bedrooms', val: aiState.bedrooms },
    { key: 'familyMembers', label: 'Family Members', val: aiState.familyMembers },
    { key: 'kids', label: 'Kids', val: aiState.kids },
    { key: 'pets', label: 'Pets', val: aiState.pets },
    { key: 'budget', label: 'Budget Limit', val: aiState.budget },
    { key: 'style', label: 'Preferred Style', val: aiState.style },
    { key: 'colors', label: 'Colors', val: aiState.colors },
    { key: 'lighting', label: 'Lighting', val: aiState.lighting },
    { key: 'flooring', label: 'Flooring', val: aiState.flooring },
    { key: 'ceiling', label: 'Ceiling', val: aiState.ceiling },
    { key: 'furnitureNeeds', label: 'Furniture Needs', val: aiState.furnitureNeeds },
    { key: 'storage', label: 'Storage', val: aiState.storage },
    { key: 'naturalLight', label: 'Natural Light', val: aiState.naturalLight }
  ];

  const filledCount = checklist.filter(item => item.val).length;
  const progressPct = Math.round((filledCount / checklist.length) * 100);

  // Check if assistant returned any proposal in messages
  const lastAssistantWithBoard = [...messages].reverse().find(msg => msg.role === 'assistant' && msg.board);
  const activeProposal = lastAssistantWithBoard?.board;

  return (


    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

      {/* =========================
      CENTER AI REASONING PANEL
      (Part 2)
  ========================= */}
      <section className="lg:col-span-4 flex flex-col lg:h-full lg:min-h-0">
        <div className="glass-panel rounded-3xl bg-white dark:bg-[#121018] border border-[#C4C3D0]/30 shadow-xl flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden">

          {/* =========================
      AI BRAIN HEADER
  ========================= */}
          <div className="px-5 py-4 border-b border-[#C4C3D0]/25 bg-gradient-to-r from-[#FFFFF0] via-[#FAF7FB] to-[#E6E6FA] dark:from-[#18141F] dark:via-[#1D1826] dark:to-[#18141F]">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C28285] to-[#E6E6FA] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Aurora AI Brain
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-gray-400">
                    Interior Design Agent
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2">

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>

                <span className="text-[10px] font-bold text-emerald-600">
                  ONLINE
                </span>

              </div>

            </div>
          </div>

          {/* =========================
      AI STATUS
  ========================= */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#C4C3D0]/20">

              <div className="flex justify-between items-center mb-2">

                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C28285]">
                  Design Progress
                </span>

                <span className="text-xs font-black text-[#C28285]">
                  {progressPct}%
                </span>

              </div>

              <div className="h-2 rounded-full overflow-hidden bg-[#E6E6FA] dark:bg-black/30">

                <div
                  style={{ width: `${progressPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#C28285] via-[#E6E6FA] to-[#C4C3D0] transition-all duration-700"
                />

              </div>

            </div>

            {/* =========================
      ACTIVE PARAMETERS
  ========================= */}

            <div className="px-5 pt-4">

              <div className="flex items-center justify-between mb-3">

                <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C28285]">
                  Active Parameters
                </h4>

                <span className="text-[9px] text-slate-400">
                  Live
                </span>

              </div>

            </div>

            <div className="px-5 pb-4 space-y-2">

              {checklist.map((item) => (

                <div
                  key={item.key}
                  className={`rounded-2xl p-3 border transition-all ${item.val
                    ? "bg-[#FFFFF0] dark:bg-[#1A1622] border-[#C28285]/20"
                    : "bg-white dark:bg-[#15121B] border-[#C4C3D0]/20"
                    }`}
                >

                  <div className="flex items-start gap-3">

                    {item.val ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    )}

                    <div className="min-w-0">

                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-gray-200">
                        {item.label}
                      </p>

                      <p className="text-[10px] mt-1 text-slate-500 dark:text-gray-400 truncate">
                        {item.val || "Waiting..."}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>



            {/* <div className="px-5 pb-5">

              <div className="rounded-3xl border border-[#C4C3D0]/25 bg-gradient-to-br from-[#FFFFF0] to-[#FFFFFF] dark:from-[#18141F] dark:to-[#121018] p-4">

                <div className="flex items-center justify-between mb-4">

                  <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C28285]">
                    Selected Palette
                  </h4>

                  <Palette className="w-4 h-4 text-[#C28285]" />

                </div>

                <div className="grid grid-cols-2 gap-3">

                  {[
                    {
                      name: "Dusty Rose",
                      color: "#C28285",
                    },
                    {
                      name: "Lavender",
                      color: "#E6E6FA",
                    },
                    {
                      name: "Lavender Grey",
                      color: "#C4C3D0",
                    },
                    {
                      name: "Ivory",
                      color: "#FFFFF0",
                    },
                  ].map((item) => (

                    <div
                      key={item.name}
                      className="rounded-2xl border border-[#C4C3D0]/20 bg-white dark:bg-[#1A1622] p-3"
                    >

                      <div
                        className="w-full h-12 rounded-xl border border-black/5"
                        style={{
                          background: item.color,
                        }}
                      />

                      <p className="mt-2 text-[10px] font-bold text-slate-700 dark:text-gray-200">
                        {item.name}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          

            <div className="px-5 pb-5">

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-[#FFFFF0] dark:bg-[#1A1622] border border-[#C4C3D0]/25 p-4">

                  <BrainCircuit className="w-5 h-5 text-[#C28285] mb-2" />

                  <p className="text-[9px] uppercase font-black tracking-wider text-slate-500">
                    AI Confidence
                  </p>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    96%
                  </h3>

                </div>

                <div className="rounded-2xl bg-[#FFFFF0] dark:bg-[#1A1622] border border-[#C4C3D0]/25 p-4">

                  <BadgeDollarSign className="w-5 h-5 text-[#C28285] mb-2" />

                  <p className="text-[9px] uppercase font-black tracking-wider text-slate-500">
                    Budget
                  </p>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    $3.2k
                  </h3>

                </div>

              </div>

            </div> */}


            {/* <div className="px-5 pb-5">

              <div className="rounded-3xl bg-gradient-to-br from-[#C28285] to-[#E6E6FA] p-[1px]">

                <div className="rounded-[22px] bg-white dark:bg-[#17131F] p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[#C28285]">
                        Current Style
                      </p>

                      <h3 className="mt-2 text-base font-black text-slate-900 dark:text-white">
                        Modern Luxury
                      </h3>

                      <p className="mt-1 text-[10px] text-slate-500 dark:text-gray-400">
                        Warm Minimal • Premium Interior
                      </p>

                    </div>

                    <Sparkles className="w-10 h-10 text-[#C28285]" />

                  </div>

                </div>

              </div>

            </div> */}
          </div>


          <div className="flex-shrink-0 px-5 pb-5">

            <div className="flex items-center justify-between mb-3">

              <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C28285]">
                AI Thinking
              </h4>

              <span className="text-[9px] text-emerald-500 font-bold">
                LIVE
              </span>

            </div>

            <div className="h-56 overflow-y-auto rounded-3xl bg-[#1A1722] border border-[#C4C3D0]/20 p-4 space-y-2">

              {reasoningLogs.map((log, index) => (

                <div
                  key={index}
                  className="flex gap-2"
                >

                  <Sparkles className="w-3.5 h-3.5 text-[#C28285] mt-0.5 flex-shrink-0" />

                  <p className="text-[10px] leading-relaxed text-gray-300">
                    {log}
                  </p>

                </div>

              ))}

              {loading && (

                <div className="flex items-center gap-2 text-[#C28285] animate-pulse">

                  <Loader2 className="w-3 h-3 animate-spin" />

                  <span className="text-[10px]">
                    Aurora AI is analyzing your room...
                  </span>

                </div>

              )}

            </div>
          </div>
        </div>
      </section>

      {/* =========================
      RIGHT CHAT PANEL
      (Part 3)
  ========================= */}
      <section className="lg:col-span-8 flex flex-col lg:h-full lg:min-h-0">
        <div className="glass-panel rounded-3xl bg-white dark:bg-[#121018] border border-[#C4C3D0]/30 shadow-xl flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden">

          {/* =======================================
      CHAT HEADER
  ======================================== */}

          <div className="flex-shrink-0 px-6 py-5 border-b border-[#C4C3D0]/25 bg-gradient-to-r from-[#FFFFF0] via-[#FAF7FB] to-[#E6E6FA] dark:from-[#18141F] dark:via-[#1D1826] dark:to-[#18141F]">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C28285] via-[#D39A9F] to-[#E6E6FA] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>

                <div>

                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Aurora AI Interior Designer
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Personalized Interior Planning Assistant
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">

                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    AI Online
                  </span>

                </div>

                <button
                  onClick={() => {
                    setMessages([
                      {
                        role: "assistant",
                        content:
                          "Welcome to Aurora Interiors AI 🌸\n\nLet's design your dream home together.\n\nWhat type of property do you have?"
                      }
                    ]);

                    setAiState({});
                    setSuggestions(["House", "Apartment", "Duplex"]);
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#1B1724] border border-[#C4C3D0]/30 hover:border-[#C28285] transition-all text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300"
                >
                  Reset Session
                </button>

              </div>

            </div>

          </div>

          {/* =======================================
      GENERATED DESIGN CARD
  ======================================== */}

          {activeProposal && (

            <div className="flex-shrink-0 mx-5 mt-5 rounded-3xl overflow-hidden border border-[#C4C3D0]/25 bg-gradient-to-br from-[#FFFDF8] via-white to-[#F8F6FD] dark:from-[#191520] dark:via-[#141019] dark:to-[#1B1724] shadow-xl">

              <div className="grid md:grid-cols-2 gap-6 p-6">

                <div>

                  <img
                    src={activeProposal.imageUrl}
                    alt={activeProposal.title}
                    className="w-full aspect-[16/10] object-cover rounded-2xl"
                  />

                </div>

                <div className="flex flex-col justify-center">

                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-[#C28285]/10 text-[#C28285] text-[10px] font-bold uppercase tracking-widest">
                    Generated Design
                  </span>

                  <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                    {activeProposal.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-gray-300">
                    {activeProposal.summary}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-6">

                    <button
                      onClick={() => handleExportPDF(activeProposal)}
                      className="px-5 py-3 rounded-2xl bg-[#C28285] hover:bg-[#B86D72] text-white font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export PDF
                    </button>

                    <button
                      onClick={handleRegenerate}
                      className="px-5 py-3 rounded-2xl border border-[#C4C3D0]/30 bg-white dark:bg-[#1A1722] text-slate-700 dark:text-gray-200 hover:border-[#C28285] transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}
          {/* =======================================
      CHAT MESSAGES
  ======================================== */}

          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-5 bg-gradient-to-b from-[#FFFFF8] via-white to-[#FAF8FC] dark:from-[#121018] dark:via-[#15111C] dark:to-[#18141F]">
            {messages.map((msg, i) => (

              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`flex items-end gap-3 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >

                  {/* Avatar */}

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === "user"
                      ? "bg-gradient-to-br from-[#C28285] to-[#B86D72] text-white"
                      : "bg-gradient-to-br from-[#E6E6FA] to-[#C4C3D0] text-[#6F6487]"
                      }`}
                  >
                    {msg.role === "user"
                      ? <User className="w-4 h-4" />
                      : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}

                  <div
                    className={`rounded-3xl px-5 py-4 shadow-md border ${msg.role === "user"
                      ? "bg-[#C28285] border-[#C28285] text-white"
                      : "bg-white dark:bg-[#1A1722] border-[#C4C3D0]/30 text-slate-700 dark:text-gray-200"
                      }`}
                  >

                    {renderMessageContent(msg.content)}

                  </div>

                </div>

              </div>

            ))}

            {/* AI Typing */}

            {loading && (

              <div className="flex justify-start">

                <div className="flex gap-3 items-end max-w-sm">

                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E6E6FA] to-[#C4C3D0] flex items-center justify-center">

                    <Sparkles className="w-4 h-4 text-[#6F6487]" />

                  </div>

                  <div className="rounded-3xl bg-white dark:bg-[#1A1722] border border-[#C4C3D0]/25 px-5 py-4 shadow">

                    <div className="flex gap-2">

                      <span className="w-2 h-2 rounded-full bg-[#C28285] animate-bounce"></span>

                      <span className="w-2 h-2 rounded-full bg-[#C28285] animate-bounce [animation-delay:150ms]"></span>

                      <span className="w-2 h-2 rounded-full bg-[#C28285] animate-bounce [animation-delay:300ms]"></span>

                    </div>

                    {synthesisStep && (

                      <p className="mt-3 text-[11px] text-slate-500 dark:text-gray-400 font-medium">

                        {synthesisStep}

                      </p>

                    )}

                  </div>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>
          {/* =======================================
      QUICK SUGGESTIONS
  ======================================== */}

          {suggestions.length > 0 && (
            <div className="flex-shrink-0 px-5 py-4 border-t border-[#C4C3D0]/20 bg-[#FFFFF8] dark:bg-[#18141F]">

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C28285] mb-3">
                Quick Suggestions
              </p>

              <div className="flex flex-wrap gap-3">

                {suggestions.map((sug, index) => (

                  <button
                    key={index}
                    type="button"
                    onClick={() => sendMessage(sug)}
                    className="px-4 py-2 rounded-full bg-white dark:bg-[#211C2A] border border-[#C4C3D0]/30 hover:border-[#C28285] hover:bg-[#FFF6F6] dark:hover:bg-[#2A2433] text-xs font-semibold text-slate-700 dark:text-gray-200 transition-all duration-300 shadow-sm"
                  >
                    {sug}
                  </button>

                ))}

              </div>

            </div>
          )}

          {/* =======================================
      CHAT INPUT
  ======================================== */}

          <div className="flex-shrink-0 border-t border-[#C4C3D0]/20 bg-gradient-to-r from-[#FFFFF0] via-white to-[#FAF7FB] dark:from-[#18141F] dark:via-[#17131E] dark:to-[#1A1622] p-5">

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-3"
            >

              <div className="flex-1">

                <div className="relative">

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your dream interior..."
                    className="w-full rounded-2xl border border-[#C4C3D0]/30 bg-white dark:bg-[#211C2A] px-5 py-4 pr-14 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#C28285] focus:ring-4 focus:ring-[#C28285]/10 transition-all"
                  />

                  <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C28285]" />

                </div>

              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-[56px] w-[56px] rounded-2xl bg-gradient-to-br from-[#C28285] via-[#D19194] to-[#E6E6FA] text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>

            </form>

            <div className="flex items-center justify-between mt-4">

              <p className="text-[10px] text-slate-500 dark:text-gray-400">
                Aurora AI analyzes your space, furniture sizes, lighting, color harmony & budget.
              </p>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C28285]">
                Agentic AI
              </span>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
