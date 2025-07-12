"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Alert 컴포넌트를 직접 정의
const Alert = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'destructive' }) => {
  const variantClasses = variant === 'destructive' 
    ? 'border-red-500 bg-red-50 text-red-900' 
    : 'border-gray-200 bg-gray-50'
  
  return (
    <div className={`rounded-lg border p-4 ${variantClasses}`}>
      {children}
    </div>
  )
}

const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm">{children}</p>
}
import { CheckCircle, XCircle, Loader2, PlayCircle, FileText } from 'lucide-react'

interface TestResult {
  platform: string
  success: boolean
  error?: string
  screenshots: string[]
  logs: string[]
}

interface EnvironmentCheck {
  playwright: boolean
  browsers: { chromium: boolean, firefox: boolean, webkit: boolean }
  permissions: { write: boolean, network: boolean }
}

export function PlaywrightTestPanel() {
  const [isChecking, setIsChecking] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [envCheck, setEnvCheck] = useState<EnvironmentCheck | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  
  const checkEnvironment = async () => {
    setIsChecking(true)
    try {
      const response = await fetch('/api/screenshot/test-environment')
      const data = await response.json()
      
      if (data.success) {
        setEnvCheck(data.environment)
      } else {
        alert('환경 검증 실패: ' + data.error)
      }
    } catch (error) {
      console.error('Environment check error:', error)
      alert('환경 검증 중 오류가 발생했습니다.')
    } finally {
      setIsChecking(false)
    }
  }
  
  const runTest = async (platform?: string) => {
    setIsTesting(true)
    setTestResults([])
    
    try {
      const response = await fetch('/api/screenshot/test-environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.results) {
          setTestResults(data.results)
        } else if (data.result) {
          setTestResults([data.result])
        }
      } else {
        alert('테스트 실행 실패: ' + data.error)
      }
    } catch (error) {
      console.error('Test execution error:', error)
      alert('테스트 실행 중 오류가 발생했습니다.')
    } finally {
      setIsTesting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* 환경 검증 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Playwright 환경 검증</CardTitle>
            <Button 
              onClick={checkEnvironment} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  검증 중...
                </>
              ) : (
                '환경 검증'
              )}
            </Button>
          </div>
        </CardHeader>
        {envCheck && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {envCheck.playwright ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>Playwright 설치 상태</span>
              </div>
              
              <div className="ml-7 space-y-2">
                <div className="flex items-center gap-2">
                  {envCheck.browsers.chromium ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Chromium 브라우저</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {envCheck.permissions.write ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>파일 쓰기 권한</span>
              </div>
              
              <div className="flex items-center gap-2">
                {envCheck.permissions.network ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>네트워크 접근 권한</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* 테스트 실행 */}
      <Card>
        <CardHeader>
          <CardTitle>플랫폼 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => runTest()} 
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    테스트 중...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    전체 테스트
                  </>
                )}
              </Button>
              
              {['notion', 'cursor', 'claude'].map(platform => (
                <Button
                  key={platform}
                  onClick={() => runTest(platform)}
                  disabled={isTesting}
                  variant="outline"
                >
                  {platform}
                </Button>
              ))}
            </div>
            
            {/* 테스트 결과 */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <Card key={index} className={result.success ? 'border-green-500' : 'border-red-500'}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">{result.platform}</h4>
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.error && (
                        <Alert variant="destructive">
                          <AlertDescription>{result.error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {result.logs.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            로그
                          </h5>
                          <div className="bg-gray-100 rounded p-3 text-sm font-mono max-h-40 overflow-y-auto">
                            {result.logs.map((log, i) => (
                              <div key={i} className="text-gray-700">{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.screenshots.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium mb-2">
                            스크린샷 ({result.screenshots.length}개)
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            {result.screenshots.map((screenshot, i) => (
                              <img
                                key={i}
                                src={screenshot.replace(process.cwd() + '/public', '')}
                                alt={`Screenshot ${i + 1}`}
                                className="rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}