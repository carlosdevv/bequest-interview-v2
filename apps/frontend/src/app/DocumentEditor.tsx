import { registerLicense } from '@syncfusion/ej2-base';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
// import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
// import '@syncfusion/ej2-lists/styles/material.css';
// import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';
import '@syncfusion/ej2-react-documenteditor/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import { useEffect, useRef, useState } from 'react';
import { useClauses, type Clause } from '../context/ClausesContext';

DocumentEditorContainerComponent.Inject(Toolbar);
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhNYVJ2WmFZfVtgdV9DZVZUTGYuP1ZhSXxWdkZiWH9fdXJVR2BaWEE='
);

export const DocumentEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const { selectedClauses, setSelectedClauses, addClauseToDocument } =
    useClauses();
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const prevSelectedClausesRef = useRef<Clause[]>([]);

  const handleOpen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0];
    const editor = editorRef.current!.documentEditor;

    if (!fileInput) return;

    setSelectedClauses([]);

    editor.open(fileInput);
    setActionsOpen(false);
  };

  const handleDownload = async () => {
    const editor = editorRef.current!.documentEditor;
    const blob = await editor.saveAsBlob('Docx');

    const file = new File([blob], `Document.docx`, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    downloadFile(file);
    setActionsOpen(false);
  };

  useEffect(() => {
    const editor = editorRef.current!.documentEditor;

    editor.contentChange = async () => {
      console.log('Document Content changed');
      const blob = await editor.saveAsBlob('Docx');
      const file = new File([blob], `Document.docx`, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      console.log(file);
    };
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current.documentEditor;

    if (!isDocumentLoaded) {
      editor.openBlank();
      setIsDocumentLoaded(true);
      return;
    }

    if (
      selectedClauses.length !== prevSelectedClausesRef.current.length ||
      JSON.stringify(selectedClauses.map(c => c.uniqueId)) !==
      JSON.stringify(prevSelectedClausesRef.current.map(c => c.uniqueId))
    ) {
      editor.openBlank();

      let topicCounter = 1;
      selectedClauses.forEach(clause => {
        editor.editor.insertText(clause.title.toUpperCase());
        editor.editor.insertText('\n');

        const paragraphs = clause.content.split(/\n\n+/);
        paragraphs.forEach(paragraph => {
          editor.editor.insertText(`${topicCounter}.    `);
          editor.editor.insertText(paragraph);
          editor.editor.insertText('\n\n');

          topicCounter++;
        });
      });
    }

    prevSelectedClausesRef.current = JSON.parse(JSON.stringify(selectedClauses));
  }, [selectedClauses]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#1a2841] text-[#e0c99b] p-4 pr-0 flex items-center">
        <button className="mr-4 bg-[#2c3e5d] rounded-full h-6 w-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-light">Document Editor</h1>
        <div className="ml-auto">
          <div className="relative">
            <button
              className="bg-[#2c3e5d] text-[#e0c99b] py-2 px-4 rounded flex items-center"
              onClick={() => setActionsOpen(!actionsOpen)}
            >
              Actions
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {actionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Open
                  </button>
                  <input
                    type="file"
                    accept=".docx"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleOpen}
                  />
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white">
        <DocumentEditorContainerComponent
          height="100%"
          serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
          enableToolbar={true}
          showPropertiesPane={false}
          ref={editorRef}
          toolbarItems={[
            'Undo',
            'Redo',
            'Separator',
            'Image',
            'Table',
            'Separator',
            'Header',
            'Footer',
            'PageSetup',
            'PageNumber',
            'Separator',
            'InsertFootnote',
            'InsertEndnote',
            'Separator',
            'FormFields',
            'Separator',
            'Find',
          ]}
          contentChange={(e) => {}}
        />
      </div>
    </div>
  );
};

const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
};
