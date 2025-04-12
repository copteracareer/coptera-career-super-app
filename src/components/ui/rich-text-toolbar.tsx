'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  XCircle,
  LayoutGrid,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </Button>
      {/* <Button
        type="button"
        variant={
          editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Button> */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={16} />
      </Button>
      <Button
        type="button"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        <XCircle size={16} />
      </Button>
      <Button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent(
              '<section data-draggable-section><p>New Section</p></section>',
            )
            .run()
        }
      >
        <LayoutGrid size={16} />
      </Button>
    </div>
  );
}
