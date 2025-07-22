import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export default function VideoComponent({ node }) {
  const url = node.attrs.src
  const videoId = url?.split('v=')[1]?.split('&')[0] ?? ''

  if (!videoId) return null

  return (
    <NodeViewWrapper className="youtube-wrapper" style={{ margin: '1em 0' }}>
      <div style={{   display: "flex", justifyContent: 'center', alignItems: 'center', width: '100%', }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          style={{ width: '100%', height: '100%', aspectRatio: '16/9', borderRadius: '8px' }}
        />
      </div>
    </NodeViewWrapper>
  )
}
