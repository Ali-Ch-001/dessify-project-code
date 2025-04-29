// app/(dashboard)/closet_manager/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

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

// fade‐in for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ClosetManagerPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) return;
      const { data: rows, error: fetchErr } = await supabase
        .from('userwardrobe')
        .select('id, image_url, category')
        .eq('user_id', user.id);
      if (fetchErr) console.error(fetchErr);
      else setItems(rows as WardrobeItem[]);
    })();
  }, []);

  const handleDelete = async (item: WardrobeItem) => {
    setItems(xs => xs.map(x => x.id === item.id ? { ...x, deleting: true } : x));
    const [, path] = item.image_url.split('/storage/v1/object/public/userwardrobe/');
    const { error: upErr } = await supabase.storage.from('userwardrobe').remove([path]);
    if (upErr) {
      console.error(upErr);
      return setItems(xs => xs.map(x => x.id === item.id ? { ...x, deleting: false } : x));
    }
    const { error: delErr } = await supabase.from('userwardrobe').delete().eq('id', item.id);
    if (delErr) {
      console.error(delErr);
      return setItems(xs => xs.map(x => x.id === item.id ? { ...x, deleting: false } : x));
    }
    setItems(xs => xs.filter(x => x.id !== item.id));
  };

  const handleCategoryChange = async (item: WardrobeItem, newCat: string) => {
    setItems(xs => xs.map(x => x.id === item.id ? { ...x, updating: true } : x));
    const { error } = await supabase.from('userwardrobe').update({ category: newCat }).eq('id', item.id);
    if (error) console.error(error);
    setItems(xs =>
      xs.map(x =>
        x.id === item.id
          ? { ...x, category: error ? x.category : newCat, updating: false }
          : x
      )
    );
    setEditingId(null);
  };

  const grouped = items.reduce<Record<string, WardrobeItem[]>>((acc, it) => {
    acc[it.category] = [...(acc[it.category]||[]), it];
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl p-6 text-white text-center shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h1 className="text-3xl font-extrabold">Your Closet</h1>
      </motion.div>

      {/* Category Sections */}
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
          <h2 className="text-2xl font-semibold text-gray-800">
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {imgs.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative bg-white rounded-2xl overflow-hidden"
                >
                  {/* Image */}
                  <div
                    className="relative w-full h-32 sm:h-40 cursor-pointer"
                    onClick={() => setModalUrl(item.image_url)}
                  >
                    <Image
                      src={item.image_url}
                      alt={cat}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={item.deleting}
                    className="absolute top-2 right-2 bg-white/90 p-1 rounded-full hover:bg-white z-10"
                  >
                    {item.deleting
                      ? <div className="loader w-4 h-4"/>
                      : <Trash2 size={16} className="text-red-600"/>
                    }
                  </button>

                  {/* Change Category Button */}
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
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      ))}

      {items.length === 0 && (
        <p className="text-center text-gray-500">No items in your closet yet.</p>
      )}

      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {modalUrl && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalUrl(null)}
          >
            <motion.div
              className="relative bg-white rounded-2xl overflow-hidden max-w-lg w-11/12 p-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setModalUrl(null)}
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
              >
                <X size={24}/>
              </button>
              <div className="relative w-full h-[60vh] sm:h-[70vh]">
                <Image
                  src={modalUrl!}
                  alt="Full Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Picker Popup */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingId(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-11/12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Category
                </h3>
                <button onClick={() => setEditingId(null)}>
                  <X size={20} className="text-gray-600 hover:text-gray-900"/>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-auto">
                {CATEGORY_OPTIONS.map(opt => (
                  <motion.button
                    key={opt}
                    onClick={() => {
                      const item = items.find(i => i.id === editingId);
                      if (item) handleCategoryChange(item, opt);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
