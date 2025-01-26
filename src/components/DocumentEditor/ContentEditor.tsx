import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Page } from '../../types';

interface ContentEditorProps {
  page: Page;
  onUpdate: (updatedPage: Page) => void;
}

export function ContentEditor({ page, onUpdate }: ContentEditorProps) {
  const primaryEditor = useEditor({
    extensions: [StarterKit],
    content: page.content.primary,
    onUpdate: ({ editor }) => {
      onUpdate({
        ...page,
        content: {
          ...page.content,
          primary: editor.getHTML()
        }
      });
    }
  });

  const secondaryEditor = useEditor({
    extensions: [StarterKit],
    content: page.content.secondary,
    onUpdate: ({ editor }) => {
      onUpdate({
        ...page,
        content: {
          ...page.content,
          secondary: editor.getHTML()
        }
      });
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Contenu Principal</h3>
        <div className="prose max-w-none">
          <EditorContent editor={primaryEditor} />
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Contenu Secondaire</h3>
        <div className="prose max-w-none">
          <EditorContent editor={secondaryEditor} />
        </div>
      </div>
    </div>
  );
}