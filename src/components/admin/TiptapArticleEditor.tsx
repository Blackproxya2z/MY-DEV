'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';

export function TiptapArticleEditor({
  valueHtml,
  onChangeHtml,
}: {
  valueHtml: string;
  onChangeHtml: (html: string, json: Record<string, unknown>) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your journal article content here...',
      }),
    ],
    content: valueHtml,
    editorProps: {
      attributes: {
        class:
          'odyssey-prose min-h-[240px] p-4 rounded-b-xl bg-canvas text-fg focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeHtml(ed.getHTML(), ed.getJSON() as Record<string, unknown>);
    },
  });

  useEffect(() => {
    if (editor && valueHtml !== editor.getHTML()) {
      editor.commands.setContent(valueHtml, false);
    }
  }, [valueHtml, editor]);

  if (!editor) {
    return (
      <textarea
        value={valueHtml}
        onChange={(e) => onChangeHtml(e.target.value, {})}
        rows={8}
        className="w-full p-4 rounded-xl border border-border bg-canvas text-fg text-sm font-mono"
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-raised overflow-hidden">
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Rich text formatting toolbar"
        className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-raised"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('bold')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('italic')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('underline')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('bulletList')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('orderedList')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('blockquote')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg text-xs font-mono ${
            editor.isActive('codeBlock')
              ? 'bg-accent text-canvas'
              : 'text-muted hover:text-fg hover:bg-canvas'
          }`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Surface */}
      <EditorContent editor={editor} />
    </div>
  );
}

