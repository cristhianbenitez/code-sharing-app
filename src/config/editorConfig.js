export const defaultEditorOptions = {
  suggestOnTriggerCharacters: true,
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  parameterHints: {
    enabled: true,
    cycle: true
  },
  snippetSuggestions: 'top',
  suggestSelection: 'first',
  tabCompletion: 'on',
  wordBasedSuggestions: true,
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: 'on',
  inlineSuggest: {
    enabled: true
  },
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  autoClosingTags: true,
  autoIndent: 'full',
  formatOnPaste: true,
  formatOnType: true
};

export const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'html', 'css', 'sql', 'php'];
