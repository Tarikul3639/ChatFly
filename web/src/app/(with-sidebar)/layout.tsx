import Sidebar from "../components/Sidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="shrink-0 bg-white shadow-lg h-screen overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-grow bg-gray-100 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
