import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function UncategorizedPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">미분류</h1>
          <p className="text-muted-foreground mt-2">
            카테고리가 지정되지 않은 포스트들입니다.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새 포스트
        </Button>
      </div>
      
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">미분류 포스트가 없습니다.</p>
      </div>
    </div>
  )
}