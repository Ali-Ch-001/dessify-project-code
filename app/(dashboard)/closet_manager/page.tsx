// app/(dashboard)/closet_manager/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shirt, 
  Filter,
  Grid,
  List,
  Download,
  Share2,
  Heart,
  Eye,
  Search
} from 'lucide-react';
import { PanInfo } from 'framer-motion';

type WardrobeItem = {
  id: string;
  image_url: string;
  category: string;
  deleting?: boolean;
  updating?: boolean;
};

const CATEGORY_OPTIONS = [
  't-shirt','dress shirt','blouse','tank top','sweater','hoodie','jacket','coat',
  'jeans','pants','trousers','chinos','leggings','shorts','skirt',
  'sneakers','joggers','boots','sandals','heels','loafers','flats',
  'boxer briefs','bra','vest',
  'ring','watch','bracelet','necklace','belt','hat'
];

// Section fade-in
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Swipe animation variants
const swipeVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: '0%',
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0
  })
};

// Container variants for staggered animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Item variants for individual cards
const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function ClosetManagerPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // per-category mobile carousel state
  const [mobileIndex, setMobileIndex] = useState<Record<string, number>>({});
  const [mobileDir, setMobileDir] = useState<Record<string, number>>({});

  // fetch & group
  useEffect(() => {
    (async () => {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) return;
      const { data: rows, error: fetchErr } = await supabase
        .from('userwardrobe')
        .select('id, image_url, category')
        .eq('user_id', user.id);
      if (fetchErr) console.error(fetchErr);
      else {
        setItems(rows as WardrobeItem[]);
        // init mobileIndex & mobileDir
        const byCat = (rows as WardrobeItem[]).reduce<Record<string,WardrobeItem[]>>((acc,it)=>{
          acc[it.category] = [...(acc[it.category]||[]), it];
          return acc;
        }, {});
        const idx: Record<string,number> = {};
        const dir: Record<string,number> = {};
        Object.keys(byCat).forEach(cat => { idx[cat]=0; dir[cat]=0 });
        setMobileIndex(idx);
        setMobileDir(dir);
      }
    })();
  }, []);

  // delete
  const handleDelete = async (item: WardrobeItem) => {
    setItems(xs => xs.map(x => x.id===item.id?{...x,deleting:true}:x));
    const [, path] = item.image_url.split('/storage/v1/object/public/userwardrobe/');
    const { error: upErr } = await supabase.storage.from('userwardrobe').remove([path]);
    if (upErr) return setItems(xs=>xs.map(x=>x.id===item.id?{...x,deleting:false}:x));
    const { error: delErr } = await supabase.from('userwardrobe').delete().eq('id',item.id);
    if (delErr) return setItems(xs=>xs.map(x=>x.id===item.id?{...x,deleting:false}:x));
    setItems(xs=>xs.filter(x=>x.id!==item.id));
  };

  // category change
  const handleCategoryChange = async (item: WardrobeItem, newCat: string) => {
    setItems(xs => xs.map(x=>x.id===item.id?{...x,updating:true}:x));
    const { error } = await supabase.from('userwardrobe').update({category:newCat}).eq('id',item.id);
    if (error) console.error(error);
    setItems(xs => xs.map(x=>x.id===item.id?{
      ...x,
      category: error? x.category : newCat,
      updating: false
    }:x));
    setEditingId(null);
  };

  // grouped once
  const grouped = items.reduce<Record<string,WardrobeItem[]>>((acc,it)=>{
    acc[it.category] = [...(acc[it.category]||[]), it];
    return acc;
  },{});

  // slide carousel
  const slide = (cat: string, dir: -1|1) => {
    const list = grouped[cat]||[];
    if (!list.length) return;
    const cur = mobileIndex[cat]||0;
    const next = (cur + dir + list.length) % list.length;
    setMobileDir(d=>({...d,[cat]:dir}));
    setMobileIndex(i=>({...i,[cat]:next}));
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = (searchParams?.get('q') ?? '').trim();
  const sortParam = (searchParams?.get('sort') ?? 'date_desc').trim();
  const [search, setSearch] = useState<string>(q);
  const [sort, setSort] = useState<string>(sortParam);

  // Keep local search in sync if URL changes externally
  useEffect(() => {
    setSearch(q);
    setSort(sortParam);
  }, [q, sortParam]);

  // Debounce and write search to URL (so it can be shared/back-forward)
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      const trimmed = (search ?? '').trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      if (sort) params.set('sort', sort);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, pathname, router]);

  // Filter items based on category and search query (category or filename in URL)
  const filteredItems = useMemo(() => {
    let base = selectedCategory === 'all' ? items : items.filter(it => it.category === selectedCategory);
    const needle = (search ?? '').trim().toLowerCase();
    if (needle) {
      base = base.filter(it => {
      const inCategory = it.category.toLowerCase().includes(needle);
      const name = it.image_url.split('/').pop() || '';
      return inCategory || name.toLowerCase().includes(needle);
      });
    }

    // local sort: name/category/date (id is proxy for date)
    const [key, dir] = (sort || 'date_desc').split('_');
    const sign = dir === 'asc' ? 1 : -1;
    base = [...base].sort((a, b) => {
      if (key === 'name') {
        const an = (a.image_url.split('/').pop() || '').toLowerCase();
        const bn = (b.image_url.split('/').pop() || '').toLowerCase();
        return an.localeCompare(bn) * sign;
      }
      if (key === 'category') {
        return a.category.localeCompare(b.category) * sign;
      }
      // fallback: date by id as proxy (not ideal, but stable enough client-side)
      return (a.id > b.id ? 1 : -1) * sign;
    });
    return base;
  }, [items, selectedCategory, search, sort]);

  const filteredGrouped = filteredItems.reduce<Record<string,WardrobeItem[]>>((acc,it)=>{
    acc[it.category] = [...(acc[it.category]||[]), it];
    return acc;
  },{});

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/25"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Background decoration */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="flex justify-center mb-3"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Shirt size={36} className="text-yellow-300" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-1">Your Closet</h1>
          <p className="text-purple-100 text-base mb-3">Manage and organize your wardrobe items</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold">{items.length}</div>
              <div className="text-xs text-purple-200">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{Object.keys(grouped).length}</div>
              <div className="text-xs text-purple-200">Categories</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compact Filter Bar */}
      <motion.div
  className="flex justify-between items-center gap-3 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Category Filter - Compact */}
        <div className="relative">
          <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-8 pr-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none text-sm font-medium"
            >
              <option value="all">All Categories</option>
              {Object.keys(grouped).sort().map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pr-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="category_asc">Category A–Z</option>
            <option value="category_desc">Category Z–A</option>
          </select>
        </div>

        {/* Mobile Search (visible on sm: hidden) */}
        <div className="flex sm:hidden w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              aria-label="Search closet"
              placeholder="Search items..."
              className="w-full pl-9 pr-10 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

  {/* Inline Search (desktop only) */}
  <div className="hidden sm:flex items-center gap-2 w-80 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            aria-label="Search closet"
            placeholder="Search items..."
            className="w-full bg-transparent outline-none text-sm text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid' 
                ? 'bg-white shadow-sm text-purple-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list' 
                ? 'bg-white shadow-sm text-purple-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ─── MOBILE CAROUSEL ───────────────────────────── */}
      <div className="sm:hidden space-y-8">
        {Object.entries(filteredGrouped).sort(([a], [b]) => a.localeCompare(b)).map(([cat, imgs]) => {
          const idx = mobileIndex[cat] || 0;
          const dir = mobileDir[cat] || 0;
          const item = imgs[idx];
          const hasMultiple = imgs.length > 1;

          // helper to handle swipe drag end
          const handleDragEnd = (_: never, info: PanInfo) => {
            if (info.offset.x > 80 && hasMultiple) slide(cat, -1);
            if (info.offset.x < -80 && hasMultiple) slide(cat, 1);
          };

          return (
            <motion.section
              key={cat}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h2>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {imgs.length} items
                </div>
              </div>

              <div className="relative w-full">
                <AnimatePresence custom={dir}>
                  <motion.div
                    key={item.id}
                    custom={dir}
                    variants={swipeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    drag={hasMultiple ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="mx-auto bg-white rounded-2xl overflow-hidden w-full max-w-xs shadow-xl border border-gray-100"
                  >
                    {/* image */}
                    <div
                      className="relative w-full h-48 cursor-pointer group"
                      onClick={() => setModalUrl(item.image_url)}
                    >
                      <Image
                        src={item.image_url}
                        alt={cat}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <Eye className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>

                    {/* delete */}
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={item.deleting}
                      className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full z-10 hover:scale-110 transition-all duration-200"
                    >
                      {item.deleting
                        ? <div className="loader w-4 h-4"/>
                        : <Trash2 size={16} className="text-red-600"/>
                      }
                    </button>

                    {/* change */}
                    <div className="p-4 border-t border-gray-100 flex justify-center bg-gradient-to-r from-purple-50 to-indigo-50">
                      <button
                        onClick={() => setEditingId(item.id)}
                        disabled={item.updating}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all duration-200"
                      >
                        {item.updating ? 'Updating…' : 'Change Category'}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* only show arrows if multiple */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={() => slide(cat, -1)}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => slide(cat, 1)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ─── DESKTOP GRID ──────────────────────────────── */}
      <div className="hidden sm:block space-y-8">
        {Object.entries(filteredGrouped).sort(([a], [b]) => a.localeCompare(b)).map(([cat, imgs]) => (
          <motion.section
            key={cat}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-semibold">
                  {imgs.length} items
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600">Category</span>
              </div>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
            >
              {imgs.map(item => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                  className={`relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:border-purple-300 transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image Preview */}
                  <div
                    className={`relative cursor-pointer group ${
                      viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48 lg:h-56'
                    }`}
                    onClick={() => setModalUrl(item.image_url)}
                  >
                    <Image 
                      src={item.image_url} 
                      alt={cat} 
                      fill 
                      className="object-cover transition-all duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Eye className="w-4 h-4 text-gray-700" />
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={item.deleting}
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full z-10 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    {item.deleting ? (
                      <div className="loader w-4 h-4" />
                    ) : (
                      <Trash2 size={16} className="text-red-600" />
                    )}
                  </button>

                  {/* Content */}
                  <div className={`p-4 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 ${
                    viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''
                  }`}>
                    <div className={viewMode === 'list' ? 'flex-1' : 'text-center'}>
                      <button
                        onClick={() => setEditingId(item.id)}
                        disabled={item.updating}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all duration-200"
                      >
                        {item.updating ? 'Updating…' : 'Change Category'}
                      </button>
                    </div>
                    
                    {viewMode === 'list' && (
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        ))}
      </div>

      {/* ─── ENHANCED IMAGE PREVIEW MODAL ─────────────────────── */}
      <AnimatePresence>
        {modalUrl && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            exit={{opacity:0}}
            onClick={()=>setModalUrl(null)}
          >
            <motion.div
              className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden shadow-2xl"
              initial={{y:50,opacity:0}} 
              animate={{y:0,opacity:1}} 
              exit={{y:50,opacity:0}}
              transition={{type:'spring',stiffness:200,damping:25}}
              onClick={e=>e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-800">Item Preview</h3>
                <button
                  onClick={()=>setModalUrl(null)}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X size={18} className="text-gray-600"/>
                </button>
              </div>
              
              {/* Image */}
              <div className="relative w-full h-[60vh] flex items-center justify-center bg-gray-50">
                <Image 
                  src={modalUrl} 
                  alt="Full Preview" 
                  fill 
                  className="object-contain"
                />
              </div>
              
              {/* Footer Actions */}
              <div className="flex justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all duration-200 text-sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ENHANCED CATEGORY POPUP ─────────────────────────── */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            exit={{opacity:0}}
            onClick={()=>setEditingId(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20"
              initial={{scale:0.8,opacity:0}} 
              animate={{scale:1,opacity:1}} 
              exit={{scale:0.8,opacity:0}}
              transition={{type:'spring',stiffness:200,damping:20}}
              onClick={e=>e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Select Category</h3>
                  <p className="text-gray-600 mt-1">Choose the appropriate category for this item</p>
                </div>
                <button 
                  onClick={()=>setEditingId(null)}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200"
                >
                  <X size={20} className="text-gray-600"/>
                </button>
              </div>
              
              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {CATEGORY_OPTIONS.sort().map(opt=>(
                  <motion.button
                    key={opt}
                    onClick={()=>{
                      const item = items.find(i=>i.id===editingId);
                      if (item) handleCategoryChange(item,opt);
                    }}
                    whileHover={{scale:1.05}} 
                    whileTap={{scale:0.95}}
                    className="text-sm text-gray-800 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 border border-gray-200 hover:border-purple-300 transition-all duration-200 font-medium"
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}