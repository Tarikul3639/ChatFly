import Sidebar from "../components/Sidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content - Full screen on mobile, with left margin on desktop */}
      <main className="min-h-screen bg-gray-100 sm:ml-16">
        {children}
      </main>
    </>
  );
}
