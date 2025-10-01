/**
 * ESLint Plugin: Live Your Dreams Design System
 * 
 * Enforces correct usage of Design System CSS classes and components
 */

const rules = {
  'no-forbidden-css-classes': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow deprecated or non-existent CSS classes',
        category: 'Design System',
        recommended: true,
      },
      fixable: 'code',
      schema: [],
    },
    create(context) {
      // Forbidden CSS classes mapping to correct alternatives
      const forbiddenClasses = {
        'lyd-table': 'api-table',
        'table-badge': 'luxury-badge',
        'table-action': 'lyd-button ghost icon-only',
        'btn': 'lyd-button',
        'button': 'lyd-button',
        'card': 'lyd-card',
      };

      return {
        JSXAttribute(node) {
          if (node.name.name === 'className' && node.value && node.value.type === 'Literal') {
            const classNames = node.value.value.split(' ');
            
            classNames.forEach(className => {
              if (forbiddenClasses[className]) {
                context.report({
                  node,
                  message: `Use "${forbiddenClasses[className]}" instead of deprecated "${className}"`,
                  fix(fixer) {
                    const newValue = node.value.value.replace(className, forbiddenClasses[className]);
                    return fixer.replaceText(node.value, `"${newValue}"`);
                  },
                });
              }
            });
          }
        },
      };
    },
  },

  'enforce-design-system-imports': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce imports from @lyd/design-system for UI components',
        category: 'Design System',
        recommended: true,
      },
      schema: [],
    },
    create(context) {
      const designSystemComponents = [
        'Button', 'Input', 'Card', 'Table', 'Badge', 'Avatar', 
        'Alert', 'Tabs', 'Checkbox', 'Pagination'
      ];

      return {
        ImportDeclaration(node) {
          const importedNames = node.specifiers
            .filter(spec => spec.type === 'ImportSpecifier')
            .map(spec => spec.imported.name);

          const hasDesignSystemComponent = importedNames.some(name => 
            designSystemComponents.includes(name)
          );

          if (hasDesignSystemComponent && !node.source.value.includes('@lyd/')) {
            context.report({
              node,
              message: 'Design System components should be imported from @lyd packages',
            });
          }
        },
      };
    },
  },

  'no-inline-styles': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Discourage inline styles in favor of Design System classes',
        category: 'Design System',
        recommended: true,
      },
      schema: [],
    },
    create(context) {
      return {
        JSXAttribute(node) {
          if (node.name.name === 'style' && node.value) {
            context.report({
              node,
              message: 'Use Design System CSS classes instead of inline styles',
            });
          }
        },
      };
    },
  },

  'correct-button-usage': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Ensure buttons use Design System classes',
        category: 'Design System',
        recommended: true,
      },
      fixable: 'code',
      schema: [],
    },
    create(context) {
      return {
        JSXElement(node) {
          if (node.openingElement.name.name === 'button') {
            const classNameAttr = node.openingElement.attributes.find(
              attr => attr.name && attr.name.name === 'className'
            );

            if (!classNameAttr || !classNameAttr.value.value.includes('lyd-button')) {
              context.report({
                node,
                message: 'Button elements should use Design System classes (lyd-button)',
                fix(fixer) {
                  if (!classNameAttr) {
                    return fixer.insertTextAfter(
                      node.openingElement.name,
                      ' className="lyd-button"'
                    );
                  } else {
                    const currentClasses = classNameAttr.value.value;
                    const newClasses = `lyd-button ${currentClasses}`.trim();
                    return fixer.replaceText(classNameAttr.value, `"${newClasses}"`);
                  }
                },
              });
            }
          }
        },
      };
    },
  },
};

module.exports = {
  rules,
  configs: {
    recommended: {
      plugins: ['@lyd/design-system'],
      rules: {
        '@lyd/design-system/no-forbidden-css-classes': 'error',
        '@lyd/design-system/enforce-design-system-imports': 'warn',
        '@lyd/design-system/no-inline-styles': 'warn',
        '@lyd/design-system/correct-button-usage': 'error',
      },
    },
  },
};

