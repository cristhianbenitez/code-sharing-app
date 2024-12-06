import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEditor } from '../hooks/useEditor';
import { useTheme } from '../hooks/useTheme';
import { CodeEditor } from '../components/CodeEditor';
import { Layout } from '../components/Layout';
import { MESSAGES } from '../config/constants';

export default function Home() {
  const router = useRouter();
  const { currentTheme, setTheme } = useTheme();
  const { code, language, hasChanges, handleEditorDidMount, handleEditorChange, setLanguage } = useEditor();

  const [isSaving, setIsSaving] = useState(false);

  const handleShare = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });

      const { sessionId } = await response.json();
      router.push(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert(MESSAGES.SHARE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <CodeEditor
        code={code}
        language={language}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        setLanguage={setLanguage}
        onShare={handleShare}
        isShareDisabled={!hasChanges}
        isSaving={isSaving}
        shareButtonTooltip={!hasChanges ? 'Write some code to share' : undefined}
        currentTheme={currentTheme}
        onThemeChange={setTheme}
      />
    </Layout>
  );
}
