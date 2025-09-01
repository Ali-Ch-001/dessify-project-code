"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, User, LogOut, Shirt, Pencil, ShoppingCart } from "lucide-react";

export default function MobileUserMenu() {
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Open user menu"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-md hover:bg-gray-50 active:scale-95 transition"
        >
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-[60] min-w-40 rounded-xl border border-gray-200 bg-white shadow-xl p-1"
        >
          <DropdownMenu.Item
            onSelect={(e) => { e.preventDefault(); router.push("/userinfo"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
          >
            <User className="w-4 h-4 text-gray-600" /> Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={(e) => { e.preventDefault(); router.push("/styled_looks"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
          >
            <Shirt className="w-4 h-4 text-gray-600" /> Styled Looks
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(e) => { e.preventDefault(); router.push("/closet_manager"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-gray-600" /> Closet Manager
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(e) => { e.preventDefault(); router.push("/shop_your_style"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600" /> Shop Your Style
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
          <DropdownMenu.Item
            onSelect={(e) => { e.preventDefault(); router.push("/logout"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
