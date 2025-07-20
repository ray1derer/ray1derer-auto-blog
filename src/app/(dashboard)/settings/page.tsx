"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { PlaywrightTestPanel } from "@/components/playwright-test-panel"
import { Edit, Trash2, Plus } from "lucide-react"
import { getCategories, saveCategory, deleteCategory } from "@/lib/storage"

export default function SettingsPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")
  const [editingCategory, setEditingCategory] = useState<any>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    const loadedCategories = getCategories()
    setCategories(loadedCategories)
  }

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategorySlug) {
      alert("카테고리 이름과 슬러그를 모두 입력해주세요.")
      return
    }

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug: newCategorySlug,
      postCount: 0
    }

    saveCategory(newCategory)
    loadCategories()
    setNewCategoryName("")
    setNewCategorySlug("")
    setShowAddCategory(false)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
  }

  const handleSaveEdit = () => {
    if (!editingCategory.name || !editingCategory.slug) {
      alert("카테고리 이름과 슬러그를 모두 입력해주세요.")
      return
    }

    saveCategory(editingCategory)
    loadCategories()
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (categoryId === 'uncategorized') {
      alert("미분류 카테고리는 삭제할 수 없습니다.")
      return
    }

    if (confirm("정말로 이 카테고리를 삭제하시겠습니까? 해당 카테고리의 모든 포스트는 미분류로 이동됩니다.")) {
      const success = deleteCategory(categoryId)
      if (success) {
        loadCategories()
      }
    }
  }
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
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>카테고리 관리</CardTitle>
                <CardDescription>
                  포스트 카테고리를 관리합니다.
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddCategory(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                카테고리 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingCategory?.id === category.id ? (
                    <>
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                          placeholder="카테고리 이름"
                          className="w-40"
                        />
                        <Input
                          value={editingCategory.slug}
                          onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                          placeholder="슬러그"
                          className="w-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>취소</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          슬러그: {category.slug} | 포스트: {category.postCount || 0}개
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.id === 'uncategorized'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {showAddCategory && (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="카테고리 이름"
                    className="w-40"
                  />
                  <Input
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    placeholder="슬러그 (영문)"
                    className="w-32"
                  />
                  <Button size="sm" onClick={handleAddCategory}>추가</Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setShowAddCategory(false)
                    setNewCategoryName("")
                    setNewCategorySlug("")
                  }}>취소</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
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
        
        <Card>
          <CardHeader>
            <CardTitle>Playwright 테스트 환경</CardTitle>
            <CardDescription>
              자동 스크린샷 시스템의 개발 환경을 검증하고 테스트합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlaywrightTestPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}