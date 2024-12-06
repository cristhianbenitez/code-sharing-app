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
  const [error, setError] = useState(null);

  const handleShare = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create session');
      }

      if (!data.sessionId) {
        throw new Error('No session ID returned from server');
      }

      console.log('Session created:', data);
      router.push(`/session/${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setError(error.message || MESSAGES.SHARE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
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
