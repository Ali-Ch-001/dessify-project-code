"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/lib/useRequireAuth";
import {
  Sparkles,
  Wand2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Filter,
  X,
  Download,
  Share2,
  ZoomIn,
  RefreshCw,
  Shirt,
  Calendar,
  CloudRain,
  Palette,
  Ruler,
  Layers,
  Sun,
  Clock,
  DollarSign,
  User,
  MessageSquare,
  Send,
  Bot,
  Plus,
  Heart,
} from "lucide-react";

type WardrobeItem = {
  id: string;
  image_url: string;
  category: string;
};

type RecommendationParams = {
  occasion: string;
  weather: string;
  num_outfits: number;
  outfit_style: string;
  color_preference: string;
  fit_preference: string;
  material_preference: string;
  season: string;
  time_of_day: string;
  budget: string;
  personal_style: string;
};

type RecommendationResult = {
  outfitImages: string[];
  outfitDetails: Record<string, unknown> | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

type MatchedTag = {
  category: string;
  tag: string;
  confidence: number;
};

// Helper function to format tag values for display
const formatTagLabel = (value: string): string => {
  if (value === "None") return "None";
  // Replace underscores with spaces and capitalize each word
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type TagOptions = {
  occasion: string[];
  weather: string[];
  outfit_style: string[];
  color_preference: string[];
  fit_preference: string[];
  material_preference: string[];
  season: string[];
  time_of_day: string[];
  budget: string[];
  personal_style: string[];
};

export default function StyleBotPage() {
  const authReady = useRequireAuth();
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [isLoadingWardrobe, setIsLoadingWardrobe] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showOutfitChat, setShowOutfitChat] = useState(false);
  const [chatOutfitImage, setChatOutfitImage] = useState<string | null>(null);
  const [outfitChatMessages, setOutfitChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [outfitChatInput, setOutfitChatInput] = useState('');
  const [isOutfitChatLoading, setIsOutfitChatLoading] = useState(false);
  const outfitChatEndRef = useRef<HTMLDivElement>(null);
  const [savingOutfitIndex, setSavingOutfitIndex] = useState<number | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<Set<string>>(new Set());
  const [outfitRequestParams, setOutfitRequestParams] = useState<{
    occasion: string;
    weather: string;
    outfit_style: string;
  } | null>(null);
  const [userBodyFeatures, setUserBodyFeatures] = useState<{
    gender: string | null;
    body_type: string | null;
    hair_type: string | null;
    hair_color: string | null;
    eyeball_color: string | null;
    glasses: boolean | null;
    skin_tone: string | null;
  } | null>(null);
  
  // Unique ID generator to prevent duplicate keys
  const generateUniqueId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Format inline markdown (bold, italic, code) - must be defined first
  const formatInlineMarkdown = useCallback((text: string, keyPrefix: string = ''): React.ReactNode => {
    if (!text) return text;
    
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Match ***bold italic*** first (longest), then **bold**, then *italic*, then `code`
    const patterns = [
      { regex: /\*\*\*(.+?)\*\*\*/g, component: (content: string) => <strong key={`${keyPrefix}-${currentIndex++}`}><em>{content}</em></strong> },
      { regex: /\*\*(.+?)\*\*/g, component: (content: string) => <strong key={`${keyPrefix}-${currentIndex++}`}>{content}</strong> },
      { regex: /`(.+?)`/g, component: (content: string) => <code key={`${keyPrefix}-${currentIndex++}`} className="bg-gray-100 dark:bg-gray-800 px-1 md:px-1.5 py-0.5 rounded text-xs md:text-sm font-mono break-all">{content}</code> },
      { regex: /\*(.+?)\*/g, component: (content: string) => <em key={`${keyPrefix}-${currentIndex++}`}>{content}</em> },
    ];
    
    let lastIndex = 0;
    const matches: Array<{ index: number; length: number; component: React.ReactNode }> = [];
    
    // Find all matches
    patterns.forEach(({ regex, component }) => {
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          component: component(match[1]),
        });
      }
    });
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    // Remove overlapping matches (keep the first/longest)
    const filteredMatches: typeof matches = [];
    matches.forEach((match) => {
      const overlaps = filteredMatches.some(
        (existing) =>
          (match.index >= existing.index && match.index < existing.index + existing.length) ||
          (existing.index >= match.index && existing.index < match.index + match.length)
      );
      if (!overlaps) {
        filteredMatches.push(match);
      }
    });
    
    // Build parts array
    filteredMatches.forEach((match) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add formatted component
      parts.push(match.component);
      lastIndex = match.index + match.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? <>{parts}</> : text;
  }, []);

  // Format markdown text to HTML
  const formatMarkdown = useCallback((text: string): React.ReactNode => {
    if (!text) return text;
    
    // Split by lines to handle headers and lists
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let listKey = '';
    
    const closeList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={listKey} className="list-disc ml-3 md:ml-4 mb-1.5 md:mb-2 space-y-0.5 md:space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Headers (# ## ###)
      if (trimmedLine.startsWith('###')) {
        closeList();
        const headerText = trimmedLine.replace(/^###\s+/, '');
        elements.push(
          <h3 key={`h3-${index}`} className="text-sm md:text-base font-bold mt-2 md:mt-3 mb-1 md:mb-1.5">
            {formatInlineMarkdown(headerText, `h3-${index}`)}
          </h3>
        );
        return;
      } else if (trimmedLine.startsWith('##')) {
        closeList();
        const headerText = trimmedLine.replace(/^##\s+/, '');
        elements.push(
          <h2 key={`h2-${index}`} className="text-base md:text-lg font-bold mt-3 md:mt-4 mb-1.5 md:mb-2">
            {formatInlineMarkdown(headerText, `h2-${index}`)}
          </h2>
        );
        return;
      } else if (trimmedLine.startsWith('#')) {
        closeList();
        const headerText = trimmedLine.replace(/^#\s+/, '');
        elements.push(
          <h1 key={`h1-${index}`} className="text-lg md:text-xl font-bold mt-3 md:mt-4 mb-1.5 md:mb-2">
            {formatInlineMarkdown(headerText, `h1-${index}`)}
          </h1>
        );
        return;
      }
      
      // Lists (- or *)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (listItems.length === 0) {
          listKey = `ul-${index}`;
        }
        const listItemText = trimmedLine.replace(/^[-*]\s+/, '');
        listItems.push(
          <li key={`li-${index}`}>
            {formatInlineMarkdown(listItemText, `li-${index}`)}
          </li>
        );
        return;
      }
      
      // End list if we hit a non-list line
      if (listItems.length > 0 && trimmedLine) {
        closeList();
      }
      
      // Regular paragraph
      if (trimmedLine) {
        elements.push(
          <p key={`p-${index}`} className="mb-1.5 md:mb-2 leading-relaxed break-words">
            {formatInlineMarkdown(trimmedLine, `p-${index}`)}
          </p>
        );
      } else {
        // Empty line for spacing
        elements.push(<br key={`br-${index}`} />);
      }
    });
    
    // Close list if still open
    closeList();
    
    return <div className="markdown-content">{elements}</div>;
  }, [formatInlineMarkdown]);
  
  // Chat and tags state
  const [tagOptions, setTagOptions] = useState<TagOptions | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [matchedTags, setMatchedTags] = useState<MatchedTag[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showTagSelection, setShowTagSelection] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<{category: string; options: string[]; isSpecial?: boolean} | null>(null);
  const [askingForColorPreference, setAskingForColorPreference] = useState<boolean>(false);
  const [askingForTimeChoice, setAskingForTimeChoice] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recommendation parameters
  const [params, setParams] = useState<RecommendationParams>({
    occasion: "None",
    weather: "None",
    num_outfits: 3,
    outfit_style: "None",
    color_preference: "None",
    fit_preference: "None",
    material_preference: "None",
    season: "None",
    time_of_day: "None",
    budget: "None",
    personal_style: "None",
  });

  // Fetch user's wardrobe
  // IMPORTANT: Only fetch once on mount, do NOT refetch after recommendations
  // to prevent showing duplicates if backend auto-saves uploaded files
  const fetchWardrobe = useCallback(async () => {
    setIsLoadingWardrobe(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        setError("Please log in to access your wardrobe");
        return;
      }

      const { data: items, error: fetchErr } = await supabase
        .from("userwardrobe")
        .select("id, image_url, category")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // Order by creation date

      if (fetchErr) {
        throw fetchErr;
      }

      // Remove duplicates based on image_url to prevent showing same items multiple times
      const uniqueItems = items?.filter((item, index, self) => 
        index === self.findIndex((t) => t.image_url === item.image_url)
      ) || [];

      setWardrobeItems(uniqueItems);
      console.log(`Loaded ${uniqueItems.length} unique wardrobe items${items && items.length !== uniqueItems.length ? ` (${items.length - uniqueItems.length} duplicates removed)` : ''}`);
      
      if (uniqueItems.length === 0) {
        setError("Your wardrobe is empty. Please upload some items first.");
      }
    } catch (err) {
      console.error("Error fetching wardrobe:", err);
      setError("Failed to load wardrobe items");
    } finally {
      setIsLoadingWardrobe(false);
    }
  }, []);

  // Fetch user body features from profile
  const fetchUserBodyFeatures = useCallback(async () => {
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("gender, body_type, hair_type, hair_color, eyeball_color, glasses, skin_tone")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        console.error("Error fetching user profile:", profileErr);
        return;
      }

      if (profile) {
        setUserBodyFeatures({
          gender: profile.gender,
          body_type: profile.body_type,
          hair_type: profile.hair_type,
          hair_color: profile.hair_color,
          eyeball_color: profile.eyeball_color,
          glasses: profile.glasses,
          skin_tone: profile.skin_tone,
        });
      }
    } catch (err) {
      console.error("Error fetching user body features:", err);
    }
  }, []);

  // Fetch tags from backend
  const fetchTags = useCallback(async () => {
    setIsLoadingTags(true);
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      if (data.success && data.data) {
        setTagOptions(data.data);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to load style tags");
    } finally {
      setIsLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) {
      fetchWardrobe();
      fetchTags();
      fetchUserBodyFeatures();
    }
    // Only fetch once when auth is ready, don't refetch on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedOutfit || selectedOutfitIndex === null || !results?.outfitImages) return;

      if (e.key === 'Escape') {
        setSelectedOutfit(null);
        setSelectedOutfitIndex(null);
      } else if (e.key === 'ArrowLeft' && selectedOutfitIndex > 0) {
        const prevIndex = selectedOutfitIndex - 1;
        setSelectedOutfit(results.outfitImages[prevIndex]);
        setSelectedOutfitIndex(prevIndex);
      } else if (e.key === 'ArrowRight' && selectedOutfitIndex < results.outfitImages.length - 1) {
        const nextIndex = selectedOutfitIndex + 1;
        setSelectedOutfit(results.outfitImages[nextIndex]);
        setSelectedOutfitIndex(nextIndex);
      }
    };

    if (selectedOutfit) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedOutfit, selectedOutfitIndex, results]);

  // Start conversation automatically with welcome message
  useEffect(() => {
    if (tagOptions && chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateUniqueId(),
        role: "bot",
        content: "Hi! I'm your Style Bot 👋 Let me help you find the perfect outfit! What's the occasion?",
        timestamp: new Date(),
      };
      setChatMessages([welcomeMessage]);
      
      // Show occasion options
      if (tagOptions.occasion) {
        setMatchedTags(
          tagOptions.occasion.map(occ => ({
            category: "occasion",
            tag: occ,
            confidence: 1.0,
          }))
        );
        setShowTagSelection(true);
        setPendingQuestions({ 
          category: "occasion", 
          options: tagOptions.occasion,
          isSpecial: false
        });
      }
    }
  }, [tagOptions, chatMessages.length, generateUniqueId]);

  // No text input - all interactions through bubbles

  // Reset chat to start fresh
  const resetChat = () => {
    setChatMessages([]);
    setMatchedTags([]);
    setShowTagSelection(false);
    setPendingQuestions(null);
    setAskingForColorPreference(false);
    setAskingForTimeChoice(false);
    setResults(null);
    setError(null);
    setOutfitRequestParams(null);
    resetParams();
  };

  // Initialize outfit chat with image
  const handleOutfitChatInit = async (imageUrl: string) => {
    setIsOutfitChatLoading(true);
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          message: '',
          conversationHistory: [],
          bodyFeatures: userBodyFeatures,
          outfitRequestParams: outfitRequestParams,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize chat');
      }

      const data = await response.json();
      if (data.success) {
        setOutfitChatMessages([
          { role: 'assistant', content: data.message },
        ]);
      }
    } catch (error) {
      console.error('Error initializing outfit chat:', error);
      setOutfitChatMessages([
        { role: 'assistant', content: error instanceof Error ? `Sorry, ${error.message}` : 'Sorry, I had trouble analyzing the outfit. Please try again.' },
      ]);
    } finally {
      setIsOutfitChatLoading(false);
    }
  };

  // Send message in outfit chat
  const handleOutfitChatSend = async () => {
    if (!outfitChatInput.trim() || isOutfitChatLoading || !chatOutfitImage) return;

    const userMessage = outfitChatInput.trim();
    setOutfitChatInput('');
    
    // Add user message to state immediately
    const updatedMessages = [...outfitChatMessages, { role: 'user' as const, content: userMessage }];
    setOutfitChatMessages(updatedMessages);
    setIsOutfitChatLoading(true);

    try {
      // Build conversation history for Gemini (all messages except the current one we just added)
      const conversationHistory = outfitChatMessages.map((msg) => ({
        role: msg.role,
        parts: msg.content,
      }));

      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: chatOutfitImage, // Include image URL for context
          message: userMessage,
          conversationHistory,
          bodyFeatures: userBodyFeatures, // Include body features for history reconstruction
          outfitRequestParams: outfitRequestParams, // Include outfit request params
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      if (data.success) {
        setOutfitChatMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setOutfitChatMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: error instanceof Error ? `Sorry, ${error.message}` : 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsOutfitChatLoading(false);
    }
  };

  // Auto-scroll outfit chat
  useEffect(() => {
    if (outfitChatEndRef.current) {
      outfitChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outfitChatMessages]);

  // Prevent body scroll when outfit chat modal is open
  useEffect(() => {
    if (showOutfitChat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOutfitChat]);

  // Auto-classify season based on weather
  const classifySeasonFromWeather = (weather: string): string => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes("hot") || weatherLower.includes("sunny") || weatherLower.includes("warm")) {
      return "summer";
    } else if (weatherLower.includes("cold") || weatherLower.includes("freezing") || weatherLower.includes("snow")) {
      return "winter";
    } else if (weatherLower.includes("rain") || weatherLower.includes("humid")) {
      return "spring";
    } else if (weatherLower.includes("cool") || weatherLower.includes("mild")) {
      return "fall";
    }
    // Default based on current month
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  };

  // Get current time of day
  const getCurrentTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  // Get next question category to ask (new improved flow)
  const getNextQuestion = (currentParams: RecommendationParams): {category: string; question: string; options: string[]; isSpecial?: boolean} | null => {
    // Step 1: Check required parameters (occasion, weather, outfit_style)
    if (currentParams.occasion === "None") {
      return { 
        category: "occasion", 
        question: "What's the occasion? Please select one:", 
        options: tagOptions?.occasion || [] 
      };
    }
    if (currentParams.weather === "None") {
      return { 
        category: "weather", 
        question: "What's the weather like? Is it hot, cold, rainy, or something else?", 
        options: tagOptions?.weather.filter(w => w !== "any") || [] 
      };
    }
    if (currentParams.outfit_style === "None") {
      return { 
        category: "outfit_style", 
        question: "What style are you looking for? Casual, formal, or something else?", 
        options: tagOptions?.outfit_style || [] 
      };
    }

    // Step 2: Auto-classify season from weather (don't ask, just set it)
    if (currentParams.season === "None" && currentParams.weather !== "None") {
      const autoSeason = classifySeasonFromWeather(currentParams.weather);
      // Set season automatically without asking
      setParams(prev => ({ ...prev, season: autoSeason }));
      // Continue to next question immediately
      return getNextQuestion({ ...currentParams, season: autoSeason });
    }

    // Step 3: Ask about time (right now vs later)
    if (currentParams.time_of_day === "None" && !askingForTimeChoice) {
      setAskingForTimeChoice(true);
      return { 
        category: "time_choice", 
        question: "Do you want to dress up right now, or is this for later?", 
        options: ["right now", "later"],
        isSpecial: true
      };
    }

    // Step 4: If later was chosen, ask for time of day
    if (askingForTimeChoice && currentParams.time_of_day === "None") {
      return { 
        category: "time_of_day", 
        question: "What time of day is this for? Morning, afternoon, evening, or night?", 
        options: tagOptions?.time_of_day.filter(t => t !== "None" && t !== "all_day") || [] 
      };
    }

    // Step 5: Ask about color preference (with special question)
    if (currentParams.color_preference === "None" && !askingForColorPreference) {
      setAskingForColorPreference(true);
      return { 
        category: "color_choice", 
        question: "Do you have any specific color in mind, or should I recommend you?", 
        options: ["I have a color in mind", "I trust your recommendation"],
        isSpecial: true
      };
    }

    // Step 6: If user wants specific color, ask for color options
    if (askingForColorPreference && currentParams.color_preference === "None") {
      return { 
        category: "color_preference", 
        question: "What color preference would you like? Neutral, bold, pastel, or something else?", 
        options: tagOptions?.color_preference.filter(c => c !== "None") || [] 
      };
    }

    // All required questions answered, return null to trigger generation
    return null;
  };

  // Apply selected preference to params
  const applyTag = async (category: string, tag: string, skipGeneration = false) => {
    let updatedParams = {
      ...params,
      [category]: tag,
    };
    
    // Auto-classify season when weather is set
    if (category === "weather" && updatedParams.season === "None") {
      const autoSeason = classifySeasonFromWeather(tag);
      updatedParams = {
        ...updatedParams,
        season: autoSeason,
      };
    }
    
    // Reset askingForTimeChoice when time_of_day is set
    if (category === "time_of_day") {
      setAskingForTimeChoice(false);
    }
    
    setParams(updatedParams);
    
    // Add confirmation message
    const categoryLabels: Record<string, string> = {
      occasion: "occasion",
      weather: "weather",
      outfit_style: "style",
      color_preference: "color preference",
      fit_preference: "fit",
      material_preference: "material",
      season: "season",
      time_of_day: "time of day",
      budget: "budget",
      personal_style: "personal style",
    };
    
    const categoryLabel = categoryLabels[category] || category;
    const confirmationMessages: Record<string, string> = {
      occasion: `Perfect! A ${formatTagLabel(tag)} outfit it is!`,
      weather: `Got it! ${formatTagLabel(tag)} weather.`,
      outfit_style: `Love it! ${formatTagLabel(tag)} style.`,
      color_preference: `Great choice! ${formatTagLabel(tag)} colors.`,
      fit_preference: `Perfect! ${formatTagLabel(tag)} fit.`,
      material_preference: `Nice! ${formatTagLabel(tag)} material.`,
      season: `Understood! ${formatTagLabel(tag)} season.`,
      time_of_day: `Got it! ${formatTagLabel(tag)}.`,
      budget: `Perfect! ${formatTagLabel(tag)} budget.`,
      personal_style: `Love it! ${formatTagLabel(tag)} style.`,
    };
    
    const botResponse: ChatMessage = {
      id: generateUniqueId(),
      role: "bot",
      content: confirmationMessages[category] || `Great! I've noted your ${categoryLabel} preference.`,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, botResponse]);
    
    // Hide the selection panel immediately when any option is clicked
    setShowTagSelection(false);
    
    // Remove this tag from matched tags
    setMatchedTags((prev) => {
      return prev.filter(t => !(t.category === category && t.tag === tag));
    });

    // Ask next question or generate recommendations
    if (!skipGeneration) {
      setTimeout(() => {
        const nextQ = getNextQuestion(updatedParams);
        if (nextQ && tagOptions) {
          const questionMsg: ChatMessage = {
            id: generateUniqueId(),
            role: "bot",
            content: nextQ.question,
            timestamp: new Date(),
          };
          setChatMessages((prev) => [...prev, questionMsg]);
          setPendingQuestions({ category: nextQ.category, options: nextQ.options, isSpecial: nextQ.isSpecial });
        } else {
          // All questions answered, generate recommendations
          generateRecommendationsFromParams(updatedParams);
        }
      }, 800);
    }
  };

  // Generate recommendations from params
  const generateRecommendationsFromParams = async (paramsToUse: RecommendationParams) => {
    if (wardrobeItems.length < 2) {
      const warningMessage: ChatMessage = {
        id: generateUniqueId(),
        role: "bot",
        content: "I need at least 2 items in your wardrobe to generate outfit recommendations. Please upload more items first.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, warningMessage]);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);

    const loadingMessage: ChatMessage = {
      id: generateUniqueId(),
      role: "bot",
      content: "Perfect! Let me create some amazing outfit recommendations for you...",
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, loadingMessage]);

    try {
      // Convert wardrobe to files
      const wardrobeFiles = await convertWardrobeToFiles();
      
      if (wardrobeFiles.length === 0) {
        throw new Error("Failed to load wardrobe images");
      }

      if (wardrobeFiles.length < 2) {
        throw new Error(`Only ${wardrobeFiles.length} wardrobe image(s) could be loaded. You need at least 2 items to generate outfits.`);
      }

      console.log(`Sending ${wardrobeFiles.length} wardrobe files to API...`);
      console.log('Params being sent to API:', paramsToUse);

      // Prepare form data with params
      const formData = new FormData();
      wardrobeFiles.forEach((file, index) => {
        formData.append("files", file);
        console.log(`Added file ${index + 1}: ${file.name} (${file.size} bytes)`);
      });
      formData.append("occasion", paramsToUse.occasion);
      formData.append("weather", paramsToUse.weather);
      formData.append("num_outfits", paramsToUse.num_outfits.toString());
      formData.append("outfit_style", paramsToUse.outfit_style);
      formData.append("color_preference", paramsToUse.color_preference);
      formData.append("fit_preference", paramsToUse.fit_preference);
      formData.append("material_preference", paramsToUse.material_preference);
      formData.append("season", paramsToUse.season);
      formData.append("time_of_day", paramsToUse.time_of_day);
      formData.append("budget", paramsToUse.budget);
      formData.append("personal_style", paramsToUse.personal_style);
      
      // Log all form data values to verify skipped values are "None"
      console.log('Form data values being sent:');
      console.log('occasion:', paramsToUse.occasion);
      console.log('weather:', paramsToUse.weather);
      console.log('color_preference:', paramsToUse.color_preference);
      console.log('fit_preference:', paramsToUse.fit_preference);
      console.log('material_preference:', paramsToUse.material_preference);
      console.log('season:', paramsToUse.season);
      console.log('time_of_day:', paramsToUse.time_of_day);
      console.log('budget:', paramsToUse.budget);
      console.log('personal_style:', paramsToUse.personal_style);

      // Call API
      const response = await fetch("/api/recommend", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data);
        // Store the params used for this outfit generation
        setOutfitRequestParams({
          occasion: paramsToUse.occasion !== "None" ? paramsToUse.occasion : "",
          weather: paramsToUse.weather !== "None" ? paramsToUse.weather : "",
          outfit_style: paramsToUse.outfit_style !== "None" ? paramsToUse.outfit_style : "",
        });
        
        // Add success message
        const successMessage: ChatMessage = {
          id: generateUniqueId(),
          role: "bot",
          content: `Perfect! I've created ${data.data.outfitImages?.length || 0} amazing outfit recommendation(s) for you. Check them out below!`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, successMessage]);
      } else {
        throw new Error(data.error || "Failed to get recommendations");
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to generate recommendations";
      setError(errorMsg);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: generateUniqueId(),
        role: "bot",
        content: `Sorry, I couldn't create recommendations right now: ${errorMsg}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert wardrobe image URLs to Files
  const convertWardrobeToFiles = async (): Promise<File[]> => {
    const files: File[] = [];

    console.log(`Converting ${wardrobeItems.length} wardrobe items to files...`);

    for (const item of wardrobeItems) {
      try {
        const response = await fetch(item.image_url);
        if (!response.ok) {
          console.warn(`Failed to fetch image ${item.id}:`, response.status);
          continue;
        }
        const blob = await response.blob();
        
        // Determine correct file extension from MIME type or URL
        let extension = "jpg"; // default
        const mimeType = blob.type.toLowerCase();
        
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
          extension = "jpg";
        } else if (mimeType.includes("png")) {
          extension = "png";
        } else if (mimeType.includes("webp")) {
          extension = "webp";
        } else if (mimeType.includes("gif")) {
          extension = "gif";
        } else {
          // Try to extract from URL
          const urlExtension = item.image_url.split(".").pop()?.toLowerCase();
          if (urlExtension && ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "tif"].includes(urlExtension)) {
            extension = urlExtension === "jpeg" ? "jpg" : urlExtension;
          }
        }
        
        // Ensure MIME type is set correctly
        const correctMimeType = extension === "jpg" || extension === "jpeg" 
          ? "image/jpeg" 
          : extension === "png" 
          ? "image/png"
          : extension === "webp"
          ? "image/webp"
          : extension === "gif"
          ? "image/gif"
          : blob.type || "image/jpeg";
        
        const file = new File(
          [blob],
          `wardrobe-${item.id}.${extension}`,
          { type: correctMimeType }
        );
        
        files.push(file);
        console.log(`Successfully converted item ${item.id} (${item.category}) - ${extension}, ${correctMimeType}`);
      } catch (err) {
        console.error(`Error converting wardrobe item ${item.id}:`, err);
      }
    }

    console.log(`Successfully converted ${files.length} out of ${wardrobeItems.length} items`);
    return files;
  };

  // Generate recommendations
  const generateRecommendations = async () => {
    if (wardrobeItems.length === 0) {
      setError("Please upload some items to your wardrobe first");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
      // Validate minimum wardrobe size
      if (wardrobeItems.length < 2) {
        throw new Error("You need at least 2 items in your wardrobe to generate outfit recommendations");
      }

      // Convert wardrobe to files
      const wardrobeFiles = await convertWardrobeToFiles();
      
      if (wardrobeFiles.length === 0) {
        throw new Error("Failed to load wardrobe images");
      }

      if (wardrobeFiles.length < 2) {
        throw new Error(`Only ${wardrobeFiles.length} wardrobe image(s) could be loaded. You need at least 2 items to generate outfits.`);
      }

      console.log(`Sending ${wardrobeFiles.length} wardrobe files to API...`);

      // Prepare form data
      const formData = new FormData();
      wardrobeFiles.forEach((file, index) => {
        formData.append("files", file);
        console.log(`Added file ${index + 1}: ${file.name} (${file.size} bytes)`);
      });
      formData.append("occasion", params.occasion);
      formData.append("weather", params.weather);
      formData.append("num_outfits", params.num_outfits.toString());
      formData.append("outfit_style", params.outfit_style);
      formData.append("color_preference", params.color_preference);
      formData.append("fit_preference", params.fit_preference);
      formData.append("material_preference", params.material_preference);
      formData.append("season", params.season);
      formData.append("time_of_day", params.time_of_day);
      formData.append("budget", params.budget);
      formData.append("personal_style", params.personal_style);

      // Call API
      const response = await fetch("/api/recommend", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data);
        // Store the params used for this outfit generation
        setOutfitRequestParams({
          occasion: params.occasion !== "None" ? params.occasion : "",
          weather: params.weather !== "None" ? params.weather : "",
          outfit_style: params.outfit_style !== "None" ? params.outfit_style : "",
        });
        // IMPORTANT: Do NOT refetch wardrobe after getting recommendations
        // The recommended outfits are just for display, not to be saved
        // Refetching here would cause duplicates if the backend auto-saves files
      } else {
        throw new Error(data.error || "Failed to get recommendations");
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to generate recommendations");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset parameters to defaults
  const resetParams = () => {
    setParams({
      occasion: "None",
      weather: "None",
      num_outfits: 3,
      outfit_style: "None",
      color_preference: "None",
      fit_preference: "None",
      material_preference: "None",
      season: "None",
      time_of_day: "None",
      budget: "None",
      personal_style: "None",
    });
  };

  // Save outfit to styled looks
  const saveToStyledLooks = async (imageUrl: string, index: number) => {
    setSavingOutfitIndex(index);
    try {
      // Get the session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Please log in to save outfits');
      }

      const response = await fetch('/api/save-styled-look', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          imageUrl,
          params: {
            occasion: params.occasion !== "None" ? params.occasion : null,
            weather: params.weather !== "None" ? params.weather : null,
            outfit_style: params.outfit_style !== "None" ? params.outfit_style : null,
            color_preference: params.color_preference !== "None" ? params.color_preference : null,
            fit_preference: params.fit_preference !== "None" ? params.fit_preference : null,
            material_preference: params.material_preference !== "None" ? params.material_preference : null,
            season: params.season !== "None" ? params.season : null,
            time_of_day: params.time_of_day !== "None" ? params.time_of_day : null,
            budget: params.budget !== "None" ? params.budget : null,
            personal_style: params.personal_style !== "None" ? params.personal_style : null,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save outfit');
      }

      const data = await response.json();
      if (data.success) {
        setSavedOutfits(prev => new Set(prev).add(imageUrl));
        // Show success message
        const successMessage: ChatMessage = {
          id: generateUniqueId(),
          role: "bot",
          content: "Great! I've saved this outfit to your Styled Looks! 💖",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Error saving outfit:', error);
      const errorMessage: ChatMessage = {
        id: generateUniqueId(),
        role: "bot",
        content: `Sorry, I couldn't save this outfit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSavingOutfitIndex(null);
    }
  };

  if (!authReady) {
    return null;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl shadow-purple-500/25"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="flex justify-center mb-2 md:mb-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wand2 size={28} className="md:w-9 md:h-9 text-yellow-300" />
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Style Bot</h1>
          <p className="text-purple-100 text-sm md:text-base px-2">
            Get AI-powered outfit recommendations from your wardrobe
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-4 md:gap-6 mt-3 md:mt-4">
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold">{wardrobeItems.length}</div>
              <div className="text-xs text-purple-200">Wardrobe Items</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold">{params.num_outfits}</div>
              <div className="text-xs text-purple-200">Outfits to Generate</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 text-sm md:text-base"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Chat with Style Bot</h2>
          </div>
          <button
            onClick={resetChat}
            className="p-1.5 md:p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600 hover:text-purple-700"
            title="Start new conversation"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
        
        {/* Chat Messages - Enhanced chat-like interface */}
        <div className="h-[400px] md:h-[500px] overflow-y-auto mb-3 md:mb-4 space-y-3 md:space-y-4 p-3 md:p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8 md:py-12">
              <Bot className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 text-purple-400" />
              <p className="font-semibold text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Hi! I&apos;m your Style Bot 👋</p>
              <p className="text-xs md:text-sm">Let me help you find the perfect outfit!</p>
            </div>
          ) : (
            <>
              {chatMessages.map((msg, index) => {
                const showBubbles = index === chatMessages.length - 1 && pendingQuestions;
                const isGeneratingMessage = isGenerating && msg.content.includes("create some amazing outfit recommendations");
                return (
                  <div key={msg.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                    >
                      {msg.role === "bot" && (
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center mr-1.5 md:mr-2 flex-shrink-0">
                          <Bot className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p className="text-xs md:text-sm leading-relaxed">{msg.content}</p>
                        {/* Loading Animation */}
                        {isGeneratingMessage && (
                          <div className="mt-2 md:mt-3 flex items-center gap-1.5 md:gap-2">
                            <div className="flex gap-1 md:gap-1.5">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-600 rounded-full"
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut",
                                  }}
                                />
                              ))}
                            </div>
                            <motion.div
                              className="flex-1 h-0.5 md:h-1 bg-purple-100 rounded-full overflow-hidden"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                style={{ width: "30%" }}
                              />
                            </motion.div>
                            <motion.div
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-600 flex items-center justify-center ml-1.5 md:ml-2 flex-shrink-0">
                          <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Show bubbles right after bot message */}
                    {showBubbles && pendingQuestions && tagOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 md:ml-10 mt-2 md:mt-3 mb-3 md:mb-4"
                      >
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {pendingQuestions.options.map((option) => (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                // Add user selection as a message
                                const userSelection: ChatMessage = {
                                  id: generateUniqueId(),
                                  role: "user",
                                  content: formatTagLabel(option),
                                  timestamp: new Date(),
                                };
                                setChatMessages((prev) => [...prev, userSelection]);
                                
                                if (pendingQuestions.isSpecial) {
                                  // Handle special questions
                                  if (pendingQuestions.category === "time_choice") {
                                    if (option === "right now" || option.toLowerCase().includes("now")) {
                                      const currentTime = getCurrentTimeOfDay();
                                      applyTag("time_of_day", currentTime, false);
                                      setAskingForTimeChoice(false);
                                    } else {
                                      // "later" - will ask for time of day in getNextQuestion
                                      setPendingQuestions(null);
                                      setTimeout(() => {
                                        const nextQ = getNextQuestion(params);
                                        if (nextQ && tagOptions) {
                                          const questionMsg: ChatMessage = {
                                            id: (Date.now() + 1).toString(),
                                            role: "bot",
                                            content: nextQ.question,
                                            timestamp: new Date(),
                                          };
                                          setChatMessages((prev) => [...prev, questionMsg]);
                                          setPendingQuestions({ category: nextQ.category, options: nextQ.options, isSpecial: nextQ.isSpecial });
                                        }
                                      }, 800);
                                    }
                                  } else if (pendingQuestions.category === "color_choice") {
                                    if (option.toLowerCase().includes("trust") || option.toLowerCase().includes("recommend")) {
                                      // Don't set color preference
                                      setAskingForColorPreference(false);
                                      setPendingQuestions(null);
                                      setTimeout(() => {
                                        generateRecommendationsFromParams(params);
                                      }, 800);
                                    } else {
                                      // Will ask for color preference
                                      setPendingQuestions(null);
                                      setTimeout(() => {
                                        const nextQ = getNextQuestion(params);
                                        if (nextQ && tagOptions) {
                                          const questionMsg: ChatMessage = {
                                            id: (Date.now() + 1).toString(),
                                            role: "bot",
                                            content: nextQ.question,
                                            timestamp: new Date(),
                                          };
                                          setChatMessages((prev) => [...prev, questionMsg]);
                                          setPendingQuestions({ category: nextQ.category, options: nextQ.options, isSpecial: nextQ.isSpecial });
                                        }
                                      }, 800);
                                    }
                                  }
                                } else {
                                  applyTag(pendingQuestions.category, option);
                                  setPendingQuestions(null);
                                }
                              }}
                              className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-full font-medium text-xs md:text-sm transition-all duration-200 ${
                                pendingQuestions.isSpecial
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                                  : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                              }`}
                            >
                              {formatTagLabel(option)}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </>
          )}
        </div>
      </motion.div>

      {/* Tag Selection Panel - Hidden */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'none' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Style Preferences</h2>
          </div>
          <button
            onClick={resetParams}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Occasion */}
    <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={14} />
              Occasion
            </label>
            <select
              value={params.occasion}
              onChange={(e) => setParams({ ...params, occasion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.occasion.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Weather */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CloudRain size={14} />
              Weather
            </label>
            <select
              value={params.weather}
              onChange={(e) => setParams({ ...params, weather: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.weather.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Outfits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Shirt size={14} />
              Number of Outfits
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={params.num_outfits}
              onChange={(e) => setParams({ ...params, num_outfits: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Outfit Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Outfit Style
            </label>
            <select
              value={params.outfit_style}
              onChange={(e) => setParams({ ...params, outfit_style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.outfit_style.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Color Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette size={14} />
              Color Preference
            </label>
            <select
              value={params.color_preference}
              onChange={(e) => setParams({ ...params, color_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.color_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Ruler size={14} />
              Fit Preference
            </label>
            <select
              value={params.fit_preference}
              onChange={(e) => setParams({ ...params, fit_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.fit_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Material Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Layers size={14} />
              Material Preference
            </label>
            <select
              value={params.material_preference}
              onChange={(e) => setParams({ ...params, material_preference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.material_preference.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sun size={14} />
              Season
            </label>
            <select
              value={params.season}
              onChange={(e) => setParams({ ...params, season: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.season.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={14} />
              Time of Day
            </label>
            <select
              value={params.time_of_day}
              onChange={(e) => setParams({ ...params, time_of_day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.time_of_day.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign size={14} />
              Budget
            </label>
            <select
              value={params.budget}
              onChange={(e) => setParams({ ...params, budget: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.budget.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Style */}
    <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User size={14} />
              Personal Style
            </label>
            <select
              value={params.personal_style}
              onChange={(e) => setParams({ ...params, personal_style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {tagOptions?.personal_style.map((opt) => (
                <option key={opt} value={opt}>
                  {formatTagLabel(opt)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={generateRecommendations}
          disabled={isGenerating || isLoadingWardrobe || wardrobeItems.length === 0}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Generate Outfit Recommendations
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Loading State */}
      {isLoadingWardrobe && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* Results Gallery */}
      <AnimatePresence>
        {results && results.outfitImages && results.outfitImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {(() => {
              const includesShop = !!(results?.outfitDetails &&
                typeof results.outfitDetails === 'object' &&
                JSON.stringify(results.outfitDetails).toLowerCase().includes('shop'));
              return (
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full border inline-flex items-center gap-1
                    bg-white text-gray-700 border-gray-200">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    {includesShop ? 'Includes Shop Your Style items' : 'From your wardrobe'}
                  </span>
    </div>
  );
            })()}
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Recommended Outfits ({results.outfitImages.length})
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    These are AI-generated outfit combinations from your wardrobe
                  </p>
                </div>
              </div>
              {results.outfitDetails && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs md:text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </button>
              )}
            </div>

            {/* Outfit Details */}
            {showDetails && results.outfitDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-4 overflow-auto"
              >
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(results.outfitDetails, null, 2)}
                </pre>
              </motion.div>
            )}

            {/* Outfit Images Grid - Optimized for horizontal images */}
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {results.outfitImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-gray-200 group"
                >
                  <div
                    className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:cursor-pointer"
                    onClick={() => {
                      // Only open popup on desktop
                      if (window.innerWidth >= 640) {
                        setSelectedOutfit(imageUrl);
                        setSelectedOutfitIndex(index);
                      }
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Recommended outfit ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      unoptimized
                    />
                    {/* Source badge overlay */}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                      {(() => {
                        const includesShop = !!(results?.outfitDetails &&
                          typeof results.outfitDetails === 'object' &&
                          JSON.stringify(results.outfitDetails).toLowerCase().includes('shop'));
                        return (
                          <span className={`text-[9px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow 
                            ${includesShop ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {includesShop ? 'Shop Your Style' : 'Your Wardrobe'}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                        <ZoomIn className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 md:px-3 md:py-1">
                        <span className="text-xs md:text-sm font-medium text-gray-800">
                          Outfit {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                          Outfit {index + 1}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500">
                          Click to view full size
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Save to Styled Looks Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveToStyledLooks(imageUrl, index);
                          }}
                          disabled={savingOutfitIndex === index || savedOutfits.has(imageUrl)}
                          whileHover={savingOutfitIndex !== index && !savedOutfits.has(imageUrl) ? { scale: 1.05, y: -2 } : {}}
                          whileTap={savingOutfitIndex !== index && !savedOutfits.has(imageUrl) ? { scale: 0.95 } : {}}
                          className={`relative px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all flex items-center gap-2 text-xs md:text-sm font-medium overflow-hidden ${
                            savedOutfits.has(imageUrl)
                              ? 'bg-pink-100 text-pink-700 border-2 border-pink-300 cursor-not-allowed shadow-sm'
                              : savingOutfitIndex === index
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-md hover:shadow-xl'
                          }`}
                          title={savedOutfits.has(imageUrl) ? "Already saved to Styled Looks" : "Add to Styled Looks"}
                        >
                          {!savedOutfits.has(imageUrl) && savingOutfitIndex !== index && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-2">
                            {savingOutfitIndex === index ? (
                              <Loader2 size={16} className="md:w-5 md:h-5 animate-spin" />
                            ) : (
                              <motion.div
                                animate={savedOutfits.has(imageUrl) ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <Heart 
                                  size={16} 
                                  className={`md:w-5 md:h-5 ${savedOutfits.has(imageUrl) ? 'fill-pink-600' : ''}`} 
                                />
                              </motion.div>
                            )}
                            <span className="hidden sm:inline whitespace-nowrap">
                              {savingOutfitIndex === index ? 'Saving...' : savedOutfits.has(imageUrl) ? 'Saved' : 'Save'}
                            </span>
                          </div>
                        </motion.button>

                        {/* Talk Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatOutfitImage(imageUrl);
                            setShowOutfitChat(true);
                            setOutfitChatMessages([]);
                            setOutfitChatInput('');
                            handleOutfitChatInit(imageUrl);
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative px-3 py-2.5 md:px-4 md:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2 text-xs md:text-sm font-medium overflow-hidden group"
                          title="Talk about this outfit"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          <div className="relative z-10 flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              <MessageSquare size={16} className="md:w-5 md:h-5" />
                            </motion.div>
                            <span className="hidden sm:inline whitespace-nowrap">Talk</span>
                          </div>
                        </motion.button>

                        {/* Download Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement("a");
                            link.href = imageUrl;
                            link.download = `outfit-${index + 1}.jpg`;
                            link.click();
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2.5 md:px-4 md:py-3 bg-white hover:bg-purple-50 rounded-xl transition-all border-2 border-gray-200 hover:border-purple-400 shadow-sm hover:shadow-md flex items-center justify-center text-xs md:text-sm font-medium"
                          title="Download"
                        >
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <Download size={16} className="md:w-5 md:h-5 text-gray-700" />
                          </motion.div>
                        </motion.button>

                        {/* View Full Size Button - Hidden on mobile */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOutfit(imageUrl);
                            setSelectedOutfitIndex(index);
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="hidden md:flex relative px-3 py-2.5 md:px-4 md:py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-xl shadow-md hover:shadow-xl transition-all items-center justify-center text-xs md:text-sm font-medium overflow-hidden group"
                          title="View Full Size"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          <div className="relative z-10">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <ZoomIn size={16} className="md:w-5 md:h-5" />
                            </motion.div>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Size Image Modal - Desktop Only */}
      <AnimatePresence>
        {selectedOutfit && results && results.outfitImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden sm:flex fixed inset-0 bg-black/40 backdrop-blur-sm z-50 items-center justify-center overflow-y-auto"
            onClick={() => {
              setSelectedOutfit(null);
              setSelectedOutfitIndex(null);
            }}
          >
            {/* Mobile: Bottom Sheet, Desktop: Centered Modal */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative bg-white w-full sm:w-auto sm:max-w-[90vw] max-h-[90vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto sm:m-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Compact Header - Mobile Optimized */}
              <div className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex-shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
                    Outfit {selectedOutfitIndex !== null ? selectedOutfitIndex + 1 : ''}
                  </h3>
                  {results.outfitImages.length > 1 && (
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {selectedOutfitIndex !== null ? selectedOutfitIndex + 1 : ''} / {results.outfitImages.length}
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={() => {
                    setSelectedOutfit(null);
                    setSelectedOutfitIndex(null);
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 sm:p-2 hover:bg-white rounded-full transition-colors flex-shrink-0"
                >
                  <X size={18} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Image Container - Mobile Optimized */}
              <div 
                className="relative overflow-y-auto bg-gray-900 flex items-start justify-center"
                style={{ maxHeight: 'calc(90vh - 140px)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedOutfit || ''}
                  alt="Full size outfit"
                  className="w-full h-auto max-w-full object-contain block"
                />

                {/* Navigation Arrows */}
                {results.outfitImages.length > 1 && selectedOutfitIndex !== null && (
                  <>
                    {selectedOutfitIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const prevIndex = selectedOutfitIndex - 1;
                          setSelectedOutfit(results.outfitImages[prevIndex]);
                          setSelectedOutfitIndex(prevIndex);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors z-10"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {selectedOutfitIndex < results.outfitImages.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextIndex = selectedOutfitIndex + 1;
                          setSelectedOutfit(results.outfitImages[nextIndex]);
                          setSelectedOutfitIndex(nextIndex);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors z-10"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Compact Footer - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                  </motion.div>
                  <span>AI Generated</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Save Button - Compact on Mobile */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedOutfit && selectedOutfitIndex !== null) {
                        saveToStyledLooks(selectedOutfit, selectedOutfitIndex);
                      }
                    }}
                    disabled={selectedOutfit ? (savingOutfitIndex === selectedOutfitIndex || savedOutfits.has(selectedOutfit)) : false}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-semibold overflow-hidden transition-all ${
                      selectedOutfit && savedOutfits.has(selectedOutfit)
                        ? 'bg-pink-100 text-pink-700 border border-pink-300 cursor-not-allowed'
                        : savingOutfitIndex === selectedOutfitIndex
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                      {savingOutfitIndex === selectedOutfitIndex ? (
                        <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Heart 
                          size={14} 
                          className={`sm:w-4 sm:h-4 ${selectedOutfit && savedOutfits.has(selectedOutfit) ? 'fill-pink-600' : ''}`} 
                        />
                      )}
                      <span className="text-xs whitespace-nowrap">
                        {savingOutfitIndex === selectedOutfitIndex ? 'Saving...' : selectedOutfit && savedOutfits.has(selectedOutfit) ? 'Saved' : 'Save'}
                      </span>
                    </div>
                  </motion.button>

                  {/* Download Button - Compact on Mobile */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement("a");
                      link.href = selectedOutfit || '';
                      link.download = `outfit-${selectedOutfitIndex !== null ? selectedOutfitIndex + 1 : '1'}.jpg`;
                      link.click();
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-semibold shadow-md transition-all"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">Download</span>
                  </motion.button>

                  {/* Share Button - Compact on Mobile */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: "Check out this outfit recommendation!",
                          url: selectedOutfit || '',
                        });
                      } else {
                        navigator.clipboard.writeText(selectedOutfit || '');
                        alert("Image URL copied to clipboard!");
                      }
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Share2 size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit Chat Modal - Mobile Optimized */}
      <AnimatePresence>
        {showOutfitChat && chatOutfitImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center"
            style={{ touchAction: 'none' }}
            onClick={() => {
              setShowOutfitChat(false);
              setChatOutfitImage(null);
              setOutfitChatMessages([]);
              setOutfitChatInput('');
            }}
          >
            {/* Mobile: Bottom Sheet, Desktop: Centered Modal */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full sm:w-auto sm:max-w-3xl h-[75vh] sm:h-[600px] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: '75vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">Outfit Chat</h3>
                    <p className="text-white/80 text-xs truncate">Ask me anything!</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowOutfitChat(false);
                    setChatOutfitImage(null);
                    setOutfitChatMessages([]);
                    setOutfitChatInput('');
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                {/* Image Section */}
                <div className="h-28 sm:h-auto sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50 p-2 flex items-center justify-center flex-shrink-0">
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-white">
                    <Image
                      src={chatOutfitImage}
                      alt="Selected outfit"
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages Area - Scrollable */}
                  <div 
                    className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
                    style={{ 
                      overscrollBehavior: 'contain',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {outfitChatMessages.length === 0 && !isOutfitChatLoading && (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Analyzing outfit...</p>
                        </div>
                      </div>
                    )}
                    {outfitChatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <Bot className="w-3 h-3 text-purple-600" />
                              <span className="text-[10px] font-semibold text-purple-600">AI</span>
                            </div>
                          )}
                          <div className="text-xs leading-relaxed">
                            {msg.role === 'assistant' ? formatMarkdown(msg.content) : <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isOutfitChatLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white rounded-2xl px-3 py-2 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Bot className="w-3 h-3 text-purple-600" />
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={outfitChatEndRef} />
                  </div>

                  {/* Input Area - Fixed at Bottom */}
                  <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={outfitChatInput}
                        onChange={(e) => setOutfitChatInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleOutfitChatSend();
                          }
                        }}
                        placeholder="Ask about this outfit..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        disabled={isOutfitChatLoading}
                      />
                      <button
                        onClick={handleOutfitChatSend}
                        disabled={!outfitChatInput.trim() || isOutfitChatLoading}
                        className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                      >
                        {isOutfitChatLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
