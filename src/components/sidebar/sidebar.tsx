"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Home,
  FileText,
  Calendar,
  Link2,
  Instagram,
  FolderOpen,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Layers,
  Newspaper,
  Edit2
} from "lucide-react"
import { useState, useEffect } from "react"
import { getCategories, saveCategory, deleteCategory, Category } from "@/lib/storage"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["블로그 관리", "강좌"])
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)
  
  // storage에서 카테고리 불러오기
  useEffect(() => {
    const loadedCategories = getCategories()
    setDynamicCategories(loadedCategories)
  }, [])
  
  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return
    
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-')
    const newCategory: Category = {
      id: slug,
      name: newCategoryName,
      slug: slug
    }
    
    saveCategory(newCategory)
    setDynamicCategories(getCategories())
    setNewCategoryName("")
    setAddingCategory(false)
  }

  const removeCategory = (categoryId: string) => {
    if (deleteCategory(categoryId)) {
      setDynamicCategories(getCategories())
    }
  }

  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const startEditCategory = (category: Category) => {
    setEditingCategory(category.id)
    setEditingName(category.name)
  }

  const updateCategoryName = (categoryId: string) => {
    if (!editingName.trim()) return
    
    const categories = getCategories()
    const category = categories.find(c => c.id === categoryId)
    if (category) {
      category.name = editingName
      saveCategory(category)
      setDynamicCategories(getCategories())
      setEditingCategory(null)
      setEditingName("")
    }
  }

  const staticMenuItems = [
    {
      title: "대시보드",
      href: "/",
      icon: <Home className="h-4 w-4" />
    },
    {
      title: "포스트 관리",
      href: "/posts",
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "예약 발행",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: "AI 뉴스",
      href: "/ai-news",
      icon: <Newspaper className="h-4 w-4" />
    },
    {
      title: "플랫폼 연동",
      href: "/platforms",
      icon: <Link2 className="h-4 w-4" />
    },
    {
      title: "인스타그램",
      href: "/instagram",
      icon: <Instagram className="h-4 w-4" />
    },
    {
      title: "설정",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />
    }
  ]

  return (
    <div className={cn("pb-12 min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Ray1derer Auto Blog
            </h2>
            <ThemeToggle />
          </div>
          <div className="px-3">
            <Link href="/posts/new">
              <Button className="w-full justify-start mb-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                새 포스트
              </Button>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="space-y-1">
              {/* 정적 메뉴 아이템들 */}
              {staticMenuItems.map((item) => (
                <Link key={item.title} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                </Link>
              ))}
              
              {/* 블로그 관리 섹션 */}
              <div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start"
                    onClick={() => toggleExpanded("블로그 관리")}
                  >
                    <Layers className="h-4 w-4" />
                    <span className="ml-2">블로그 관리</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 mr-2"
                    onClick={() => toggleExpanded("블로그 관리")}
                  >
                    {expandedItems.includes("블로그 관리") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {expandedItems.includes("블로그 관리") && (
                  <div className="mt-1">
                    {/* 강좌 카테고리 */}
                    <div>
                      <div className="flex items-center group">
                        <Button
                          variant="ghost"
                          className="flex-1 justify-start pl-8"
                          onClick={() => toggleExpanded("강좌")}
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span className="ml-2">강좌</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={() => toggleExpanded("강좌")}
                        >
                          {expandedItems.includes("강좌") ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {expandedItems.includes("강좌") && (
                        <div className="mt-1">
                          {dynamicCategories.filter(cat => ['notion', 'obsidian', 'cursor-ai', 'claude-ai'].includes(cat.id)).map((category) => (
                            <div key={category.id} className="flex items-center group">
                              {editingCategory === category.id ? (
                                <div className="flex items-center pl-16 pr-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') updateCategoryName(category.id)
                                      if (e.key === 'Escape') {
                                        setEditingCategory(null)
                                        setEditingName("")
                                      }
                                    }}
                                    onBlur={() => updateCategoryName(category.id)}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    className="ml-1 h-6 px-2"
                                    onClick={() => updateCategoryName(category.id)}
                                  >
                                    저장
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="ml-1 h-6 px-2"
                                    onClick={() => {
                                      setEditingCategory(null)
                                      setEditingName("")
                                    }}
                                  >
                                    취소
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Link href={`/categories/lectures/${category.slug}`} className="flex-1">
                                    <Button
                                      variant={pathname === `/categories/lectures/${category.slug}` ? "secondary" : "ghost"}
                                      className="w-full justify-start pl-16 mb-1"
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="ml-2">{category.name}</span>
                                    </Button>
                                  </Link>
                                  <div className="flex opacity-0 group-hover:opacity-100">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-6 w-6"
                                      onClick={() => startEditCategory(category)}
                                      title="수정"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1 h-6 w-6"
                                      onClick={() => removeCategory(category.id)}
                                      title="삭제"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* 모든 카테고리들 (기본 카테고리 포함) */}
                    {dynamicCategories.filter(cat => !['notion', 'obsidian', 'cursor-ai', 'claude-ai'].includes(cat.id)).map((category) => (
                      <div key={category.id} className="flex items-center group">
                        {editingCategory === category.id ? (
                          <div className="flex items-center pl-8 pr-2 flex-1">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') updateCategoryName(category.id)
                                if (e.key === 'Escape') {
                                  setEditingCategory(null)
                                  setEditingName("")
                                }
                              }}
                              onBlur={() => updateCategoryName(category.id)}
                              className="flex-1 px-2 py-1 text-sm border rounded"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              className="ml-1 h-6 px-2"
                              onClick={() => updateCategoryName(category.id)}
                            >
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-1 h-6 px-2"
                              onClick={() => {
                                setEditingCategory(null)
                                setEditingName("")
                              }}
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Link href={`/categories/${category.slug}`} className="flex-1">
                              <Button
                                variant={pathname === `/categories/${category.slug}` ? "secondary" : "ghost"}
                                className="w-full justify-start pl-8 mb-1"
                              >
                                <FileText className="h-4 w-4" />
                                <span className="ml-2">{category.name}</span>
                                {category.postCount ? (
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {category.postCount}
                                  </span>
                                ) : null}
                              </Button>
                            </Link>
                            {!['uncategorized'].includes(category.id) && (
                              <div className="flex opacity-0 group-hover:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6"
                                  onClick={() => startEditCategory(category)}
                                  title="수정"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-6 w-6"
                                  onClick={() => removeCategory(category.id)}
                                  title="삭제"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    
                    {/* 카테고리 추가 */}
                    {addingCategory ? (
                      <div className="flex items-center pl-8 pr-2 mt-1">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                          onBlur={() => {
                            if (!newCategoryName.trim()) {
                              setAddingCategory(false)
                            }
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="카테고리 이름"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          className="ml-1 h-6 px-2"
                          onClick={addCategory}
                        >
                          추가
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-1 h-6 px-2"
                          onClick={() => {
                            setAddingCategory(false)
                            setNewCategoryName("")
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start pl-8 h-8 text-xs mt-1"
                        onClick={() => setAddingCategory(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        카테고리 추가
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}