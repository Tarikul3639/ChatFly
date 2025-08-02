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
      <main className="bg-gray-100 md:ml-16">
        {children}
      </main>
    </>
  );
}
