import { languages } from '../config/editorConfig';
import { useState } from 'react';

/**
 * Language selector component for the editor
 */
const LanguageSelector = ({ language, setLanguage }) => (
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md text-sm min-w-[120px]
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
  >
    {languages.map((lang) => (
      <option key={lang} value={lang}>
        {lang.charAt(0).toUpperCase() + lang.slice(1)}
      </option>
    ))}
  </select>
);

/**
 * Theme selector component for the editor
 */
const ThemeSelector = ({ currentTheme, onThemeChange }) => (
  <select
    value={currentTheme}
    onChange={(e) => onThemeChange(e.target.value)}
    className="ml-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md text-sm min-w-[100px]
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
  >
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
);

/**
 * Button to copy the current session link to clipboard
 */
const CopyLinkButton = ({ sessionId }) => {
  const [buttonText, setButtonText] = useState('Copy Link');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/session/${sessionId}`);
      setButtonText('Copied!');
      setIsCopied(true);

      // Reset button text after 2 seconds
      setTimeout(() => {
        setButtonText('Copy Link');
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      setButtonText('Failed to copy');
      setTimeout(() => setButtonText('Copy Link'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyLink}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors duration-200
        text-gray-900 dark:text-white
        hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <CopyIcon />
      {buttonText}
    </button>
  );
};

/**
 * Share button component with loading state and tooltip
 */
const ShareButton = ({ onShare, isSaving, isShareDisabled, shareButtonTooltip }) => (
  <div className="relative group">
    <button
      type="button"
      onClick={onShare}
      disabled={isSaving || isShareDisabled}
      className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-purple-500 hover:bg-purple-600 text-white"
    >
      {isSaving ? (
        <>
          <LoadingSpinner />
          Saving...
        </>
      ) : (
        <>
          <ShareIcon />
          Share Changes
        </>
      )}
    </button>
    {shareButtonTooltip && isShareDisabled && (
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1
        text-sm text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100
        transition-opacity duration-200 whitespace-nowrap"
      >
        {shareButtonTooltip}
      </div>
    )}
  </div>
);

// Icon components
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.75725 13.4142L5.63593 11.2929C4.07383 9.7308 4.07383 7.19814 5.63593 5.63604V5.63604C7.19803 4.07395 9.73069 4.07395 11.2928 5.63604L13.4141 7.75736"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.8282 14.8285L9.17139 9.17163"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5858 16.2426L12.7071 18.3639C14.2692 19.926 16.8019 19.926 18.364 18.3639V18.3639C19.9261 16.8019 19.9261 14.2692 18.364 12.7071L16.2426 10.5858"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Bottom bar component for the code editor
 */
export const EditorBottomBar = ({
  language,
  setLanguage,
  onShare,
  sessionId,
  isSaving,
  isShareDisabled,
  shareButtonTooltip,
  currentTheme,
  onThemeChange
}) => {
  return (
    <div
      className="relative flex items-center justify-between p-4
        border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1E1E]
        transition-colors duration-200"
    >
      <div className="flex items-center space-x-2">
        <LanguageSelector language={language} setLanguage={setLanguage} />
        <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
      </div>
      <div className="flex gap-2">
        {sessionId && <CopyLinkButton sessionId={sessionId} />}
        <ShareButton
          onShare={onShare}
          isSaving={isSaving}
          isShareDisabled={isShareDisabled}
          shareButtonTooltip={shareButtonTooltip}
        />
      </div>
    </div>
  );
};
