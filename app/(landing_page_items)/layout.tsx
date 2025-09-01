import NavBar from "@/components/landing/NavBar";

export default function LandingItemsLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: "Home", href: "/#home" },
    { label: "Trial", href: "/#info" },
    { label: "Shop", href: "/#shop" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <main className="relative min-h-screen bg-[#F3E8FF] overflow-x-hidden">
      <NavBar links={links} />
      <div className="pt-20">{children}</div>
    </main>
  );
}
