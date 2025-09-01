import NavBar from "@/components/landing/NavBar";
import LandingClient from "@/components/landing/LandingClient";

export default function Home() {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Trial", href: "#info" },
    { label: "Shop", href: "#shop" },
    { label: "Contact", href: "/(landing_page_items)/contact" },
  ];

  return (
    <main className="relative min-h-screen bg-[#F3E8FF] overflow-x-hidden">
      <NavBar links={links} />
      <LandingClient />
    </main>
  );
}
