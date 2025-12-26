'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Heading1,
  Heading2,
  Code
} from 'lucide-react';

interface TiptapEditorProps {
  content: any;
  onChange: (json: any) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        controls: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || '내용을 입력하세요...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] max-w-full text-inherit dark:prose-invert',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 1 }) ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => {
            const url = window.prompt('URL을 입력하세요:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'text-purple-400 bg-white/10' : 'text-gray-400'}`}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('이미지 URL을 입력하세요:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-2 rounded hover:bg-white/10 text-gray-400"
          title="Image"
        >
          <ImageIcon size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-white/10 text-gray-400 disabled:opacity-20"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-white/10 text-gray-400 disabled:opacity-20"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
