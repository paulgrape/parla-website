import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { RightAside } from "@/components/layout/RightAside";
import { MobileNav } from "@/components/layout/MobileNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full min-h-screen max-w-300 justify-center">
      <Sidebar />
      <div className="flex w-full max-w-2xl flex-col">
        <TopBar />
        <main className="flex-1 p-4 pb-24 md:px-8 md:pb-8">{children}</main>
      </div>
      <RightAside />
      <MobileNav />
    </div>
  );
}
