const createSnippet = (label, insertText, documentation, monaco) => ({
  label,
  insertText,
  documentation,
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
});

export const getSnippets = (monaco) => {
  const snippetDefinitions = {
    html: [
      {
        label: 'html5',
        insertText: [
          '<!DOCTYPE html>',
          '<html lang="en">',
          '<head>',
          '\t<meta charset="UTF-8">',
          '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">',
          '\t<title>${1:Document}</title>',
          '</head>',
          '<body>',
          '\t${2}',
          '</body>',
          '</html>'
        ].join('\n'),
        documentation: 'HTML5 template'
      },
      {
        label: 'div',
        insertText: '<div class="${1:className}">\n\t${2}\n</div>',
        documentation: 'Div with class'
      },
      {
        label: 'form',
        insertText: [
          '<form action="${1:#}" method="${2:post}">',
          '\t<label for="${3:input}">${4:Label}</label>',
          '\t<input type="text" id="${3:input}" name="${3:input}">',
          '\t<button type="submit">${5:Submit}</button>',
          '</form>'
        ].join('\n'),
        documentation: 'Form template'
      },
      {
        label: 'nav',
        insertText: [
          '<nav class="${1:navigation}">',
          '\t<ul>',
          '\t\t<li><a href="${2:#}">${3:Link 1}</a></li>',
          '\t\t<li><a href="${4:#}">${5:Link 2}</a></li>',
          '\t\t<li><a href="${6:#}">${7:Link 3}</a></li>',
          '\t</ul>',
          '</nav>'
        ].join('\n'),
        documentation: 'Navigation template'
      }
    ],
    javascript: [
      {
        label: 'cl',
        insertText: 'console.log($1);',
        documentation: 'Console log statement'
      },
      {
        label: 'fn',
        insertText: 'function ${1:name}(${2:params}) {\n\t${3}\n}',
        documentation: 'Function declaration'
      },
      {
        label: 'af',
        insertText: '(${1:params}) => {\n\t${2}\n}',
        documentation: 'Arrow function'
      }
    ],
    python: [
      {
        label: 'pr',
        insertText: 'print($1)',
        documentation: 'Print statement'
      },
      {
        label: 'def',
        insertText: 'def ${1:name}(${2:params}):\n\t${3:pass}',
        documentation: 'Function definition'
      }
    ]
  };

  // Transform snippets to include Monaco-specific properties
  const processedSnippets = {};
  Object.keys(snippetDefinitions).forEach(language => {
    processedSnippets[language] = snippetDefinitions[language].map(snippet => ({
      ...snippet,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }));
  });

  return processedSnippets;
};
