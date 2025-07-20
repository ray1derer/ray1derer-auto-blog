import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Ray1derer Auto Blog'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 20 }}>
          Ray1derer Auto Blog
        </div>
        <div style={{ fontSize: 32, opacity: 0.8 }}>
          최신 AI 도구와 생산성 향상을 위한 블로그
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.6 }}>
          Claude AI • Cursor AI • Notion • Obsidian
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}