export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Chat {chatId}</h1>
        <p>Chat interface will be implemented here.</p>
      </div>
    </div>
  )
}