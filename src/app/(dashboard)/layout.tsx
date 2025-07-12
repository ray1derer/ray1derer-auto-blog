import { Sidebar } from "@/components/sidebar/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="border-b bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-xl font-semibold">Ray1derer Auto Blog</h1>
          </div>
        </div>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}