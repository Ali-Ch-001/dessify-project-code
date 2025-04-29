'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
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
  'sneakers','boots','sandals','heels','loafers','flats',
  'boxer briefs','bra','vest',
  'ring','watch','bracelet','necklace','belt','hat'
];

export default function ClosetManagerPage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  // 1) Load user’s wardrobe on mount
  useEffect(() => {
    (async () => {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) return;
      const { data: rows, error: fetchErr } = await supabase
        .from('userwardrobe')
        .select('id, image_url, category')
        .eq('user_id', user.id);
      if (fetchErr) console.error('Fetch error:', fetchErr);
      else setItems(rows as WardrobeItem[]);
    })();
  }, []);

  // 2) Delete helper
  const handleDelete = async (item: WardrobeItem) => {
    setItems(xs =>
      xs.map(x => x.id === item.id ? { ...x, deleting: true } : x)
    );
    // derive path from URL
    const [, path] = item.image_url.split('/storage/v1/object/public/userwardrobe/');
    // remove from storage
    const { error: upErr } = await supabase
      .storage
      .from('userwardrobe')
      .remove([path]);
    if (upErr) {
      console.error('Storage delete error:', upErr);
      return setItems(xs =>
        xs.map(x => x.id === item.id ? { ...x, deleting: false } : x)
      );
    }
    // remove from table
    const { error: delErr } = await supabase
      .from('userwardrobe')
      .delete()
      .eq('id', item.id);
    if (delErr) {
      console.error('Table delete error:', delErr);
      return setItems(xs =>
        xs.map(x => x.id === item.id ? { ...x, deleting: false } : x)
      );
    }
    setItems(xs => xs.filter(x => x.id !== item.id));
  };

  // 3) Category-update helper
  const handleCategoryChange = async (item: WardrobeItem, newCat: string) => {
    setItems(xs =>
      xs.map(x => x.id === item.id ? { ...x, updating: true } : x)
    );
    const { error } = await supabase
      .from('userwardrobe')
      .update({ category: newCat })
      .eq('id', item.id);
    if (error) console.error('Update error:', error);
    setItems(xs =>
      xs.map(x =>
        x.id === item.id
          ? { ...x, category: error ? x.category : newCat, updating: false }
          : x
      )
    );
  };

  // 4) Group by category
  const grouped = items.reduce<Record<string, WardrobeItem[]>>((acc, it) => {
    acc[it.category] = [...(acc[it.category] || []), it];
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Closet</h1>

      {Object.entries(grouped).map(([category, imgs]) => (
        <section key={category}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {imgs.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Thumbnail & open‐modal */}
                  <div
                    className="cursor-pointer"
                    onClick={() => setModalUrl(item.image_url)}
                  >
                    <img
                      src={item.image_url}
                      alt={category}
                      className="w-full h-40 object-cover"
                    />
                  </div>

                  {/* Delete icon */}
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={item.deleting}
                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full z-10 hover:bg-white"
                  >
                    {item.deleting
                      ? <div className="loader w-4 h-4" />
                      : <Trash2 size={16} className="text-red-600" />
                    }
                  </button>

                  {/* Footer: subtle dropdown */}
                  <div className="p-3 flex flex-col gap-1">
                    <span className="text-xs text-gray-500">
                      Change Category Here
                    </span>
                    <select
                      value={item.category}
                      onChange={e => handleCategoryChange(item, e.target.value)}
                      disabled={item.updating}
                      className="
                        w-full text-sm text-gray-700 bg-gray-50 border border-gray-300
                        rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300
                        disabled:opacity-50
                      "
                    >
                      {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <p className="text-center text-gray-500">
          No items in your closet yet.
        </p>
      )}

      {/* Full-screen image modal */}
      <AnimatePresence>
        {modalUrl && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalUrl(null)}
          >
            <motion.div
              className="relative bg-white rounded-lg overflow-hidden max-w-lg w-full p-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setModalUrl(null)}
                className="absolute top-3 right-3 text-gray-700"
              >
                <X size={24} />
              </button>
              <img
                src={modalUrl}
                alt="full preview"
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
