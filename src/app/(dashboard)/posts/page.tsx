import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function PostsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">포스트 관리</h1>
        <Link href="/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 포스트 작성
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="포스트 검색..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">아직 작성된 포스트가 없습니다.</p>
        <p className="text-sm text-muted-foreground mt-2">
          새 포스트를 작성하여 블로그를 시작해보세요.
        </p>
      </div>
    </div>
  )
}