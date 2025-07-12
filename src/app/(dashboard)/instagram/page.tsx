"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, Grid3X3, Hash, Plus, Instagram, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function InstagramPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [postCaption, setPostCaption] = useState("")
  const [postHashtags, setPostHashtags] = useState("")
  const [savedTemplates, setSavedTemplates] = useState<string[]>([])
  const [templateName, setTemplateName] = useState("")

  const handleConnect = () => {
    if (username && password) {
      setIsConnected(true)
      setShowConnectModal(false)
      alert("인스타그램 계정이 연동되었습니다.")
    } else {
      alert("모든 필드를 입력해주세요.")
    }
  }

  const handleDisconnect = () => {
    if (confirm("정말로 연동을 해제하시겠습니까?")) {
      setIsConnected(false)
      setUsername("")
      setPassword("")
    }
  }

  const handleCreatePost = () => {
    setShowPostModal(true)
    setPostCaption("")
    setPostHashtags("")
  }

  const handlePublishPost = () => {
    alert("인스타그램 포스트가 생성되었습니다.")
    setShowPostModal(false)
  }

  const handleSaveTemplate = () => {
    if (templateName && postHashtags) {
      setSavedTemplates([...savedTemplates, postHashtags])
      alert(`"${templateName}" 템플릿이 저장되었습니다.`)
      setTemplateName("")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">인스타그램</h1>
        <Button onClick={handleCreatePost} disabled={!isConnected}>
          <Plus className="mr-2 h-4 w-4" />
          새 포스트 만들기
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              이번 달 포스트
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              게시된 포스트
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              예약된 포스트
            </CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              발행 대기 중
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              해시태그 템플릿
            </CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              저장된 템플릿
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>인스타그램 연동 상태</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">@{username}</span>
                  <span className="text-sm text-muted-foreground">계정이 연동되었습니다</span>
                </div>
                <Button variant="outline" onClick={handleDisconnect}>
                  연동 해제
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">연동 정보</h4>
                <p className="text-sm text-muted-foreground">자동 포스팅이 활성화되었습니다.</p>
                <p className="text-sm text-muted-foreground">포스트 예약 발행이 가능합니다.</p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground mb-4">
                인스타그램 계정이 연동되지 않았습니다.
              </p>
              <Button onClick={() => setShowConnectModal(true)}>인스타그램 연동하기</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 인스타그램 연동 모달 */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>인스타그램 연동</CardTitle>
              <CardDescription>
                비즈니스 계정 정보를 입력하여 연동하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">사용자명</Label>
                  <Input
                    id="username"
                    placeholder="인스타그램 사용자명"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>* Instagram Business API를 통해 안전하게 연동됩니다.</p>
                  <p>* 2단계 인증이 활성화된 경우 앱 비밀번호를 사용하세요.</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowConnectModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handleConnect}>
                    연동하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 새 포스트 만들기 모달 */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>새 인스타그램 포스트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">이미지 업로드</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-muted-foreground">클릭하여 이미지를 선택하세요</p>
                    <Input type="file" className="hidden" id="image" accept="image/*" />
                    <Button variant="outline" className="mt-2" onClick={() => document.getElementById('image')?.click()}>
                      이미지 선택
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="caption">캡션</Label>
                  <Textarea
                    id="caption"
                    placeholder="포스트 내용을 입력하세요..."
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="hashtags">해시태그</Label>
                  <Textarea
                    id="hashtags"
                    placeholder="#해시태그 #인스타그램 #블로그"
                    value={postHashtags}
                    onChange={(e) => setPostHashtags(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="템플릿 이름"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
                      템플릿 저장
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowPostModal(false)}>
                    취소
                  </Button>
                  <Button onClick={handlePublishPost}>
                    발행하기
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