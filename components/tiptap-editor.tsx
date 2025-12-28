"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered } from 'lucide-react';

const MenuBar = ({ editor, isDarkMode }: { editor: any, isDarkMode: boolean }) => {
  if (!editor) {
    return null;
  }

  const btnClass = `p-2 rounded transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`;
  const activeClass = isDarkMode ? 'bg-white/20 text-white' : 'bg-gray-200 text-black';

  return (
    <div className={`flex gap-2 p-2 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'} mb-4 flex-wrap pb-2`}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${btnClass} ${editor.isActive('strike') ? activeClass : ''}`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`${btnClass} ${editor.isActive('code') ? activeClass : ''}`}
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  )
}

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    isDarkMode?: boolean;
}

export default function TiptapEditor({ content, onChange, isDarkMode = false }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: `focus:outline-none min-h-[300px] p-4 ${isDarkMode ? 'prose-invert' : 'prose'} prose-sm sm:prose lg:prose-lg mx-auto`
        }
    },
    immediatelyRender: false,
  });

  return (
    <div className={`border ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-black'} rounded-lg overflow-hidden text-left`}>
      <MenuBar editor={editor} isDarkMode={isDarkMode} />
      <EditorContent editor={editor} />
    </div>
  )
}
