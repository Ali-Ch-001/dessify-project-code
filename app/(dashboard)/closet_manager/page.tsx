// app/(dashboard)/closet_manager/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function ClosetManagerPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl p-6 text-white text-center shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type:'spring', stiffness:300 }}
      >
        <h1 className="text-3xl font-extrabold">Your Closet</h1>
      </motion.div>

      {/* ─── MOBILE CAROUSEL ───────────────────────────── */}
      <div className="sm:hidden space-y-8">
  {Object.entries(grouped).map(([cat, imgs]) => {
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
        className="space-y-2"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </h2>

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
              className="mx-auto bg-white rounded-2xl overflow-hidden w-full max-w-xs"
            >
              {/* image */}
              <div
                className="relative w-full h-40 cursor-pointer"
                onClick={() => setModalUrl(item.image_url)}
              >
                <Image
                  src={item.image_url}
                  alt={cat}
                  fill
                  className="object-cover"
                />
              </div>

              {/* delete */}
              <button
                onClick={() => handleDelete(item)}
                disabled={item.deleting}
                className="absolute top-2 right-2 bg-white/90 p-1 rounded-full z-10"
              >
                {item.deleting
                  ? <div className="loader w-4 h-4"/>
                  : <Trash2 size={16} className="text-red-600"/>
                }
              </button>

              {/* change */}
              <div className="p-3 border-t border-gray-100 flex justify-center">
                <button
                  onClick={() => setEditingId(item.id)}
                  disabled={item.updating}
                  className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-sm font-medium px-4 py-1 rounded-md
                             hover:opacity-90 disabled:opacity-50 transition"
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
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <button
                onClick={() => slide(cat, 1)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
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
            {Object.entries(grouped).map(([cat, imgs]) => (
              <motion.section
                key={cat}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-800">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {imgs.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                        transition: { type: 'spring', stiffness: 300, damping: 20 }
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 hover:border-indigo-300 transition-all duration-300"
                    >
                      {/* Image Preview */}
                      <div
                        className="relative w-full h-48 lg:h-56 cursor-pointer"
                        onClick={() => setModalUrl(item.image_url)}
                      >
                        <Image src={item.image_url} alt={cat} fill className="object-cover transition-all duration-300" />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={item.deleting}
                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full z-10 hover:scale-110 transition-all"
                      >
                        {item.deleting ? (
                          <div className="loader w-4 h-4" />
                        ) : (
                          <Trash2 size={16} className="text-red-600" />
                        )}
                      </button>

                      {/* Change Category Button */}
                      <div className="p-4 border-t border-gray-100 flex justify-center bg-white/80 backdrop-blur-sm">
                        <button
                          onClick={() => setEditingId(item.id)}
                          disabled={item.updating}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                          {item.updating ? 'Updating…' : 'Change Category'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>


      {/* ─── IMAGE PREVIEW MODAL ─────────────────────── */}
      <AnimatePresence>
        {modalUrl && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setModalUrl(null)}
          >
            <motion.div
              className="relative bg-white rounded-2xl max-w-lg w-11/12 p-4"
              initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}}
              transition={{type:'spring',stiffness:200,damping:25}}
              onClick={e=>e.stopPropagation()}
            >
              <button
                onClick={()=>setModalUrl(null)}
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
              ><X size={24}/></button>
              <div className="relative w-full h-[60vh] sm:h-[70vh]">
                <Image src={modalUrl} alt="Full Preview" fill className="object-contain"/>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CATEGORY POPUP ─────────────────────────── */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setEditingId(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-11/12"
              initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}}
              transition={{type:'spring',stiffness:200,damping:20}}
              onClick={e=>e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Category</h3>
                <button onClick={()=>setEditingId(null)}>
                  <X size={20} className="text-gray-600 hover:text-gray-900"/>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-auto">
                {CATEGORY_OPTIONS.map(opt=>(
                  <motion.button
                    key={opt}
                    onClick={()=>{
                      const item = items.find(i=>i.id===editingId);
                      if (item) handleCategoryChange(item,opt);
                    }}
                    whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                    className="text-sm text-gray-800 px-3 py-1 bg-gray-100 rounded-full text-center hover:bg-indigo-100"
                  >
                    {opt}
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
