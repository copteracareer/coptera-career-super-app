import { Node, mergeAttributes } from '@tiptap/core';

export const DraggableSection = Node.create({
  name: 'draggableSection',
  group: 'block',
  content: 'block+',
  draggable: true,
  parseHTML() {
    return [{ tag: 'section[data-draggable-section]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, { 'data-draggable-section': '' }),
      0,
    ];
  },
});
