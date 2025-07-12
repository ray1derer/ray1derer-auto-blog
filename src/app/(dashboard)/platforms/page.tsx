"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"

const initialPlatforms = [
  {
    id: 1,
    name: "네이버 블로그",
    description: "네이버 블로그에 자동으로 포스트를 발행합니다.",
    status: "disconnected",
    icon: "N"
  },
  {
    id: 2,
    name: "티스토리",
    description: "티스토리 블로그에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "T"
  },
  {
    id: 3,
    name: "브런치",
    description: "브런치에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "B"
  },
  {
    id: 4,
    name: "워드프레스",
    description: "WordPress 사이트에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "W"
  },
  {
    id: 5,
    name: "미디엄",
    description: "Medium에 영문 포스트를 발행합니다.",
    status: "disconnected",
    icon: "M"
  },
  {
    id: 6,
    name: "벨로그",
    description: "개발자 블로그 Velog에 포스트를 발행합니다.",
    status: "disconnected",
    icon: "V"
  }
]

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null)
  const [apiKey, setApiKey] = useState("")
  const [blogId, setBlogId] = useState("")
  
  useEffect(() => {
    // localStorage에서 연동 정보 불러오기
    import('@/lib/storage').then(({ getPlatformConnections }) => {
      const connections = getPlatformConnections()
      if (connections.length > 0) {
        setPlatforms(platforms.map(platform => {
          const connection = connections.find(c => c.name === platform.name)
          if (connection && connection.status === 'connected') {
            return { ...platform, status: 'connected', username: connection.username }
          }
          return platform
        }))
      }
    })
  }, [])

  const handleConnect = (platform: any) => {
    setSelectedPlatform(platform)
    setShowConnectModal(true)
    setApiKey("")
    setBlogId("")
  }

  const handleConfirmConnect = () => {
    if (apiKey && blogId) {
      const updatedPlatform = {
        ...selectedPlatform,
        status: "connected" as const,
        username: blogId,
        connectedAt: new Date().toISOString()
      }
      
      setPlatforms(platforms.map(p => 
        p.id === selectedPlatform.id ? updatedPlatform : p
      ))
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        import('@/lib/storage').then(({ savePlatformConnection }) => {
          savePlatformConnection({
            id: selectedPlatform.id.toString(),
            name: selectedPlatform.name,
            status: 'connected',
            username: blogId,
            connectedAt: new Date().toISOString()
          })
        })
      }
      
      alert(`${selectedPlatform.name}이(가) 성공적으로 연동되었습니다.`)
      setShowConnectModal(false)
    } else {
      alert("모든 필드를 입력해주세요.")
    }
  }

  const handleDisconnect = (platformId: number) => {
    if (confirm("정말로 연동을 해제하시겠습니까?")) {
      setPlatforms(platforms.map(p => 
        p.id === platformId 
          ? { ...p, status: "disconnected" }
          : p
      ))
    }
  }

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
              {platform.status === "connected" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">연동 완료</span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    연동 해제
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleConnect(platform)}
                >
                  연동하기
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 연동 설정 모달 */}
      {showConnectModal && selectedPlatform && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>{selectedPlatform.name} 연동 설정</CardTitle>
              <CardDescription>
                API 정보를 입력하여 플랫폼을 연동하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API 키</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="API 키를 입력하세요"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedPlatform.name}에서 발급받은 API 키를 입력하세요.
                  </p>
                </div>
                <div>
                  <Label htmlFor="blogId">블로그 ID</Label>
                  <Input
                    id="blogId"
                    placeholder="블로그 ID를 입력하세요"
                    value={blogId}
                    onChange={(e) => setBlogId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    블로그 주소 또는 고유 ID를 입력하세요.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowConnectModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleConfirmConnect}>
                    연동하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}