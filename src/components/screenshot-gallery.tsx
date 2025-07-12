"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Check, Loader2, Image as ImageIcon } from 'lucide-react'

interface Screenshot {
  url: string
  filename: string
  timestamp: number
  platform?: string
}

interface ScreenshotGalleryProps {
  lessonType: string
  lessonId: number
  onSelect: (url: string) => void
  onClose: () => void
}

export function ScreenshotGallery({ lessonType, lessonId, onSelect, onClose }: ScreenshotGalleryProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUrl, setSelectedUrl] = useState<string>('')

  useEffect(() => {
    loadScreenshots()
  }, [lessonType, lessonId])

  const loadScreenshots = async () => {
    try {
      const response = await fetch(`/api/screenshot/list?type=${lessonType}&id=${lessonId}`)
      const data = await response.json()
      
      if (data.success) {
        setScreenshots(data.screenshots)
      }
    } catch (error) {
      console.error('Failed to load screenshots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>스크린샷 선택</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : screenshots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>캡처된 스크린샷이 없습니다.</p>
              <p className="text-sm mt-2">AI 자동 스크린샷 버튼을 눌러 스크린샷을 생성하세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.url}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedUrl === screenshot.url ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedUrl(screenshot.url)}
                >
                  <img
                    src={screenshot.url}
                    alt={screenshot.filename}
                    className="w-full h-40 object-cover"
                  />
                  {selectedUrl === screenshot.url && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-white bg-blue-500 rounded-full p-1" />
                    </div>
                  )}
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{screenshot.filename}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(screenshot.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {screenshots.length > 0 && (
          <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>취소</Button>
            <Button onClick={handleSelect} disabled={!selectedUrl}>
              선택한 이미지 삽입
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}