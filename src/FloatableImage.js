import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export const FloatableImage = Image.extend({
  name: 'image',

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      float: {
        default: null,
        renderHTML: (attributes) => {
          const float = attributes.float
          const style = []
if (float === 'left'){
  style.push('margin: 0 1em 0.4em 0')
}
if (float === 'right'){
  style.push('margin: 0 0 0.4em 1em')
}
style.push("width: 100px; height: auto;")
          if (float === 'left' || float === 'right') {
            style.push(`float: ${float}`)
            style.push('display: inline-block')
          } else {
            style.push('display: block')
            style.push('margin: 1em auto')
          }

          return {
            style: style.join('; '),
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },
})
