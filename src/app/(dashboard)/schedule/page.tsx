import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SchedulePage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">예약 발행</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새 예약 추가
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              오늘 발행 예정
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              포스트가 발행될 예정입니다
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              이번 주 예약
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              포스트가 예약되어 있습니다
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>예약 발행 캘린더</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">예약된 발행이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">
              포스트를 작성하고 발행 일정을 예약해보세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}