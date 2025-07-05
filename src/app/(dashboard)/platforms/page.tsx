import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const platforms = [
  {
    id: 1,
    name: "네이버 블로그",
    description: "네이버 블로그에 자동으로 포스트를 발행합니다.",
    status: "disconnected",
    icon: "N"
  },
  {
    id: 2,
    name: "WordPress",
    description: "WordPress 사이트에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "W"
  },
  {
    id: 3,
    name: "Tistory",
    description: "티스토리 블로그에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "T"
  },
  {
    id: 4,
    name: "Medium",
    description: "Medium에 영문 포스트를 발행합니다.",
    status: "disconnected",
    icon: "M"
  },
  {
    id: 5,
    name: "Velog",
    description: "개발자 블로그 Velog에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "V"
  }
]

export default function PlatformsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">플랫폼 연동</h1>
        <p className="text-muted-foreground mt-2">
          여러 블로그 플랫폼에 동시에 포스트를 발행할 수 있습니다.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </div>
                <Badge variant={platform.status === "connected" ? "default" : "secondary"}>
                  {platform.status === "connected" ? "연결됨" : "미연결"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {platform.description}
              </CardDescription>
              <Button 
                className="w-full" 
                variant={platform.status === "connected" ? "outline" : "default"}
              >
                {platform.status === "connected" ? "설정 관리" : "연동하기"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}