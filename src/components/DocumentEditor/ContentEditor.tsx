import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Page } from '../../types';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Image as ImageIcon,
  Undo, Redo, Type
} from 'lucide-react';

interface ContentEditorProps {
  page: Page;
  onUpdate: (updatedPage: Page) => void;
  onMediaUpload: (file: File) => Promise<string>;
}

const MenuButton = ({ onClick, active, children }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${
      active ? 'text-blue-500' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

const EditorMenu = ({ editor, onMediaUpload }: { editor: any; onMediaUpload: (file: File) => Promise<string> }) => {
  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await onMediaUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-1 p-2 border-b">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <Bold size={18} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <Italic size={18} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
      >
        <Underline size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
      >
        <AlignLeft size={18} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
      >
        <AlignCenter size={18} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
      >
        <AlignRight size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <List size={18} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <ListOrdered size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="p-2 rounded hover:bg-gray-100 text-gray-700">
          <ImageIcon size={18} />
        </div>
      </label>

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <MenuButton onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={18} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={18} />
      </MenuButton>
    </div>
  );
};

export function ContentEditor({ page, onUpdate, onMediaUpload }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');

  const createEditor = (content: string, field: 'primary' | 'secondary') => 
    useEditor({
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Placeholder.configure({
          placeholder: 'Commencez à écrire...',
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onUpdate({
          ...page,
          content: {
            ...page.content,
            [field]: editor.getHTML(),
          },
        });
      },
    });

  const primaryEditor = createEditor(page.content.primary, 'primary');
  const secondaryEditor = createEditor(page.content.secondary, 'secondary');

  const currentEditor = activeTab === 'primary' ? primaryEditor : secondaryEditor;

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'primary'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('primary')}
        >
          <Type size={18} className="inline mr-2" />
          Contenu Principal
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'secondary'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('secondary')}
        >
          <Type size={18} className="inline mr-2" />
          Contenu LSF
        </button>
      </div>

      <EditorMenu editor={currentEditor} onMediaUpload={onMediaUpload} />

      <div className="p-4">
        <div className={activeTab === 'primary' ? 'block' : 'hidden'}>
          <EditorContent editor={primaryEditor} />
        </div>
        <div className={activeTab === 'secondary' ? 'block' : 'hidden'}>
          <EditorContent editor={secondaryEditor} />
        </div>
      </div>

      {currentEditor && (
        <BubbleMenu editor={currentEditor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center space-x-1 bg-white shadow-lg border rounded-lg p-1">
            <MenuButton
              onClick={() => currentEditor.chain().focus().toggleBold().run()}
              active={currentEditor.isActive('bold')}
            >
              <Bold size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => currentEditor.chain().focus().toggleItalic().run()}
              active={currentEditor.isActive('italic')}
            >
              <Italic size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => currentEditor.chain().focus().toggleUnderline().run()}
              active={currentEditor.isActive('underline')}
            >
              <Underline size={14} />
            </MenuButton>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}