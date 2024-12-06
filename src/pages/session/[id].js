import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useTheme } from '../../hooks/useTheme';
import { CodeEditor } from '../../components/CodeEditor';
import { Layout } from '../../components/Layout';

export default function Session() {
  const router = useRouter();
  const { id: sessionId } = router.query;
  const { currentTheme, setTheme } = useTheme();

  // Editor state
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [initialCode, setInitialCode] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleCodeUpdate = useCallback((newCode, newLanguage) => {
    setCode(newCode);
    setInitialCode(newCode);
    setHasChanges(false);
    if (newLanguage) {
      setLanguage(newLanguage);
    }
    setLastSaved(new Date().toISOString());
    setIsLoading(false);
  }, []);

  const { userId, shareChanges, checkForUpdates } = useCollaboration(sessionId, handleCodeUpdate);

  const handleEditorChange = (value) => {
    setCode(value);
    setHasChanges(value !== initialCode);
  };

  const handleShare = async () => {
    if (isSaving || !hasChanges) return;

    try {
      setIsSaving(true);
      const { hasUpdates, error: checkError } = await checkForUpdates();
      if (checkError) throw new Error(checkError);

      if (!hasUpdates) {
        const { success, error: shareError } = await shareChanges(code, language);
        if (!success) throw new Error(shareError || 'Failed to share changes');
        setLastSaved(new Date().toISOString());
        setInitialCode(code);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error during share:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!sessionId || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading session...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
            <button
              onClick={() => {
                setError(null);
                router.push('/');
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CodeEditor
        code={code}
        language={language}
        onChange={handleEditorChange}
        setLanguage={setLanguage}
        sessionId={sessionId}
        userId={userId}
        onShare={handleShare}
        isSaving={isSaving}
        isShareDisabled={isSaving || !hasChanges}
        shareButtonTooltip={isSaving ? 'Saving changes...' : !hasChanges ? 'No changes to share' : undefined}
        currentTheme={currentTheme}
        onThemeChange={setTheme}
      />
    </Layout>
  );
}
