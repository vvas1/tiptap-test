import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import VideoComponent from './VideoComponent'

export const VideoExtension = Node.create({
  name: 'youtube',

  group: 'block',

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-youtube]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-youtube': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent)
  },
})
