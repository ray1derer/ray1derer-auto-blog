"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Loader2, AlertCircle, Check } from 'lucide-react'

interface ScreenshotCollectorProps {
  lessonType: string
  lessonId: number
  onScreenshotCollected?: (screenshotUrl: string) => void
}

export function ScreenshotCollector({ lessonType, lessonId, onScreenshotCollected }: ScreenshotCollectorProps) {
  const [isCollecting, setIsCollecting] = useState(false)
  const [url, setUrl] = useState('')
  const [selector, setSelector] = useState('')
  const [status, setStatus] = useState<'idle' | 'collecting' | 'success' | 'error' | 'auth-required'>('idle')
  const [message, setMessage] = useState('')
  const [screenshots, setScreenshots] = useState<Array<{url: string, caption: string}>>([])

  const handleCollectScreenshot = async () => {
    if (!url) {
      setMessage('URL을 입력해주세요.')
      return
    }

    setIsCollecting(true)
    setStatus('collecting')
    setMessage('스크린샷을 수집하는 중...')

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          selector: selector || 'body',
          lessonType,
          lessonId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.data.authRequired) {
          setStatus('auth-required')
          setMessage('로그인이 필요한 페이지입니다. 브라우저에서 로그인 후 다시 시도해주세요.')
        } else {
          setStatus('success')
          setMessage('스크린샷이 성공적으로 수집되었습니다!')
          
          // 스크린샷 목록 업데이트
          await loadScreenshots()
          
          if (onScreenshotCollected && data.data.screenshotUrl) {
            onScreenshotCollected(data.data.screenshotUrl)
          }
        }
      } else {
        setStatus('error')
        setMessage(data.error || '스크린샷 수집에 실패했습니다.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('스크린샷 수집 중 오류가 발생했습니다.')
    } finally {
      setIsCollecting(false)
    }
  }

  const loadScreenshots = async () => {
    try {
      const response = await fetch(`/api/screenshot?type=${lessonType}&id=${lessonId}`)
      const data = await response.json()
      
      if (data.success && data.screenshots) {
        setScreenshots(data.screenshots)
      }
    } catch (error) {
      console.error('스크린샷 목록 로드 실패:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          스크린샷 자동 수집
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="screenshot-url">웹페이지 URL</Label>
          <Input
            id="screenshot-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isCollecting}
          />
        </div>
        
        <div>
          <Label htmlFor="screenshot-selector">CSS 선택자 (선택사항)</Label>
          <Input
            id="screenshot-selector"
            placeholder="#content 또는 .main-content"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            disabled={isCollecting}
          />
          <p className="text-sm text-muted-foreground mt-1">
            특정 영역만 캡처하려면 CSS 선택자를 입력하세요. 비워두면 전체 페이지를 캡처합니다.
          </p>
        </div>
        
        <Button 
          onClick={handleCollectScreenshot} 
          disabled={isCollecting || !url}
          className="w-full"
        >
          {isCollecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              수집 중...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              스크린샷 수집
            </>
          )}
        </Button>
        
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            status === 'auth-required' ? 'bg-yellow-50 text-yellow-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {status === 'success' && <Check className="h-4 w-4" />}
            {(status === 'error' || status === 'auth-required') && <AlertCircle className="h-4 w-4" />}
            {status === 'collecting' && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="text-sm">{message}</span>
          </div>
        )}
        
        {status === 'auth-required' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">로그인이 필요합니다</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
              <li>새 브라우저 창에서 해당 사이트에 로그인하세요</li>
              <li>로그인이 완료되면 이 창으로 돌아와주세요</li>
              <li>"스크린샷 수집" 버튼을 다시 클릭하세요</li>
            </ol>
          </div>
        )}
        
        {screenshots.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">수집된 스크린샷</h4>
            <div className="grid grid-cols-2 gap-3">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <img 
                    src={screenshot.url} 
                    alt={screenshot.caption}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{screenshot.caption}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}