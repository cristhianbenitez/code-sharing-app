import Editor from '@monaco-editor/react';
import { EditorBottomBar } from './EditorBottomBar';
import { THEMES } from '../config/constants';
import { useEffect, useState } from 'react';

export const CodeEditor = ({
  code,
  language,
  onMount,
  onChange,
  setLanguage,
  onShare,
  sessionId,
  isSaving = false,
  isShareDisabled = false,
  shareButtonTooltip,
  currentTheme = THEMES.DARK.id,
  onThemeChange
}) => {
  const [editorTheme, setEditorTheme] = useState(currentTheme === 'light' ? 'vs' : 'vs-dark');

  // Update editor theme when currentTheme changes
  useEffect(() => {
    setEditorTheme(currentTheme === 'light' ? 'vs' : 'vs-dark');
  }, [currentTheme]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
      max-w-[880px] mx-auto flex flex-col h-[calc(100vh-280px)]
      border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex-grow overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={onMount}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-geist-mono)',
            padding: { top: 16 },
            lineHeight: 1.6
          }}
        />
      </div>
      <EditorBottomBar
        language={language}
        setLanguage={setLanguage}
        onShare={onShare}
        sessionId={sessionId}
        isSaving={isSaving}
        isShareDisabled={isShareDisabled}
        shareButtonTooltip={shareButtonTooltip}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
};
