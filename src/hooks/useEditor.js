import { useState, useEffect } from 'react';
import { defaultEditorOptions } from '../config/editorConfig';
import { getSnippets } from '../config/snippets';
import { EDITOR_CONFIG } from '../config/constants';

export const useEditor = () => {
  const [editorState, setEditorState] = useState({
    code: EDITOR_CONFIG.DEFAULT_CODE,
    language: 'html',
    hasChanges: false,
    initialCode: EDITOR_CONFIG.DEFAULT_CODE
  });

  const [editorInstance, setEditorInstance] = useState({
    editor: null,
    monaco: null
  });

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance({ editor, monaco });
    editor.updateOptions(defaultEditorOptions);

    editor.onDidChangeCursorSelection((e) => {
      const currentValue = editor.getValue();
      if (currentValue !== editorState.code) {
        setEditorState(prev => ({ ...prev, code: currentValue }));
      }
    });
  };

  const configureLanguageSettings = (monaco, language) => {
    if (language === 'html') {
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: 2,
          insertSpaces: true,
          wrapLineLength: 120,
          contentUnformatted: 'pre,code,textarea',
          indentInnerHtml: true
        },
        suggest: { html5: true },
        validate: true,
        hover: true
      });
    }

    if (language === 'javascript' || language === 'typescript') {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ['node_modules/@types']
      });
    }
  };

  useEffect(() => {
    const { monaco, editor } = editorInstance;
    if (monaco && editor) {
      // Register language-specific snippets
      const snippets = getSnippets(monaco);
      if (snippets[editorState.language]) {
        monaco.languages.registerCompletionItemProvider(editorState.language, {
          provideCompletionItems: () => ({
            suggestions: snippets[editorState.language].map((snippet) => ({
              ...snippet,
              kind: monaco.languages.CompletionItemKind.Snippet
            }))
          })
        });
      }

      configureLanguageSettings(monaco, editorState.language);
    }
  }, [editorInstance, editorState.language]);

  const handleEditorChange = (value) => {
    setEditorState(prev => ({
      ...prev,
      code: value,
      hasChanges: value !== prev.initialCode
    }));
  };

  const setLanguage = (language) => {
    setEditorState(prev => ({ ...prev, language }));
  };

  const setInitialCode = (code) => {
    setEditorState(prev => ({ ...prev, initialCode: code }));
  };

  return {
    ...editorState,
    editor: editorInstance.editor,
    monaco: editorInstance.monaco,
    setLanguage,
    setInitialCode,
    handleEditorDidMount,
    handleEditorChange
  };
};
