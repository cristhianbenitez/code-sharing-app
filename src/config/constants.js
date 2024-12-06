export const EDITOR_CONFIG = {
  DEFAULT_CODE: '// Write your code here',
  VIEWPORT_OFFSET: 280, // pixels to subtract from viewport height
  MAX_WIDTH: 880,
  OPTIONS: {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Outfit',
    padding: { top: 16 },
    lineHeight: 1.6
  }
};

export const THEMES = {
  LIGHT: {
    id: 'light',
    label: 'Light',
    editorTheme: 'vs',
    mode: ''
  },
  DARK: {
    id: 'dark',
    label: 'Dark',
    editorTheme: 'vs-dark',
    mode: 'dark'
  }
};

export const MESSAGES = {
  COPY_SUCCESS: 'Session link copied to clipboard!',
  SHARE_ERROR: 'Failed to create sharing session'
};
