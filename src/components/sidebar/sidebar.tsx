"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Plus
} from "lucide-react"
import { useState } from "react"

interface SidebarItem {
  title: string
  href?: string
  icon: React.ReactNode
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "대시보드",
    href: "/",
    icon: <Home className="h-4 w-4" />
  },
  {
    title: "블로그 관리",
    icon: <FolderOpen className="h-4 w-4" />,
    children: [
      {
        title: "미분류",
        href: "/categories/uncategorized",
        icon: <FileText className="h-4 w-4" />
      },
      {
        title: "강좌",
        icon: <FolderOpen className="h-4 w-4" />,
        children: [
          {
            title: "노션",
            href: "/categories/lectures/notion",
            icon: <FileText className="h-4 w-4" />
          },
          {
            title: "옵시디언",
            href: "/categories/lectures/obsidian",
            icon: <FileText className="h-4 w-4" />
          },
          {
            title: "클로드 AI",
            href: "/categories/lectures/claude-ai",
            icon: <FileText className="h-4 w-4" />
          }
        ]
      }
    ]
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

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              level > 0 && "pl-8"
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            {isExpanded ? (
              <ChevronDown className="mr-2 h-4 w-4" />
            ) : (
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
          {isExpanded && (
            <div className="mt-1">
              {item.children.map(child => renderSidebarItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link key={item.title} href={item.href!}>
        <Button
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start mb-1",
            level > 0 && `pl-${8 + level * 4}`
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </Button>
      </Link>
    )
  }

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Ray1derer Auto Blog
          </h2>
          <div className="px-3">
            <Button className="w-full justify-start mb-4" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              새 포스트
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="space-y-1">
              {sidebarItems.map(item => renderSidebarItem(item))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}