import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-2">
          시스템 설정과 사용자 정보를 관리합니다.
        </p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>프로필 설정</CardTitle>
            <CardDescription>
              블로그 작성자 정보를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="작성자 이름" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">소개</Label>
              <textarea
                id="bio"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                placeholder="간단한 자기소개를 작성해주세요."
              />
            </div>
            <Button>프로필 저장</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>발행 설정</CardTitle>
            <CardDescription>
              포스트 발행에 대한 기본 설정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-publish">자동 발행</Label>
                <p className="text-sm text-muted-foreground">
                  예약된 시간에 자동으로 포스트를 발행합니다.
                </p>
              </div>
              <Switch id="auto-publish" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">알림 설정</Label>
                <p className="text-sm text-muted-foreground">
                  발행 결과를 이메일로 받습니다.
                </p>
              </div>
              <Switch id="notifications" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API 설정</CardTitle>
            <CardDescription>
              외부 서비스 연동을 위한 API 키를 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="claude-api">Claude API Key</Label>
              <Input 
                id="claude-api" 
                type="password" 
                placeholder="sk-ant-..." 
              />
            </div>
            <Button>API 키 저장</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}