import { useEffect, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { yaml } from "@codemirror/lang-yaml";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { linter, lintGutter, Diagnostic } from "@codemirror/lint";
import {
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import * as yamlLib from "js-yaml";

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const yamlLinter = linter((view: EditorView) => {
  const diagnostics: Diagnostic[] = [];
  const text = view.state.doc.toString();
  try {
    yamlLib.load(text);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Try to extract line number from js-yaml error message
    const lineMatch = message.match(/\(line\s*(\d+)\)/);
    const line = lineMatch ? parseInt(lineMatch[1], 10) - 1 : 0;
    diagnostics.push({
      from: view.state.doc.line(Math.min(line + 1, view.state.doc.lines)).from,
      to: view.state.doc.line(Math.min(line + 1, view.state.doc.lines)).to,
      severity: "error",
      message,
    });
  }
  return diagnostics;
});

const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--cm-keyword, #c586c0)" },
  { tag: tags.string, color: "var(--cm-string, #ce9178)" },
  { tag: tags.number, color: "var(--cm-number, #b5cea8)" },
  { tag: tags.comment, color: "var(--cm-comment, #6a9955)" },
  { tag: tags.operator, color: "var(--cm-operator, #d4d4d4)" },
  { tag: tags.punctuation, color: "var(--cm-punctuation, #d4d4d4)" },
  { tag: tags.propertyName, color: "var(--cm-property, #9cdcfe)" },
  { tag: tags.bool, color: "var(--cm-bool, #569cd6)" },
  { tag: tags.null, color: "var(--cm-null, #569cd6)" },
]);

export default function YamlEditor({ value, onChange, className = "" }: YamlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        yaml(),
        keymap.of([...defaultKeymap, indentWithTab]),
        yamlLinter,
        syntaxHighlighting(customHighlightStyle),
        EditorView.contentAttributes.of({
          spellcheck: "false",
          autocapitalize: "off",
          autocorrect: "off",
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            isInternalChange.current = true;
            onChange(update.state.doc.toString());
            isInternalChange.current = false;
          }
        }),
        EditorView.theme({
          "&.cm-editor": {
            fontSize: "13px",
            fontFamily: "var(--font-mono, 'Fira Code', 'JetBrains Mono', monospace)",
            border: "1px solid var(--surface-border-light, #d0d0da)",
            borderRadius: "var(--radius-md, 8px)",
            backgroundColor: "var(--surface-elevated, #1e1e2e)",
          },
          ".cm-content": {
            padding: "var(--space-md, 12px)",
            color: "var(--text-primary, #e0e0e0)",
          },
          ".cm-gutters": {
            backgroundColor: "var(--surface-elevated, #1e1e2e)",
            borderRight: "none",
            color: "var(--text-muted, #888)",
            paddingLeft: "4px",
            paddingRight: "4px",
            fontSize: "11px",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(255,255,255,0.05)",
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(255,255,255,0.03)",
          },
          ".cm-focused": {
            outline: "none",
            borderColor: "var(--color-primary, #6366f1)",
          },
          ".cm-cursor": {
            borderLeftColor: "var(--text-primary, #e0e0e0)",
            borderLeftWidth: "2px",
          },
          ".cm-selectionBackground": {
            backgroundColor: "rgba(99, 102, 241, 0.3)",
          },
          ".cm-lintRange-error": {
            textDecoration: "underline wavy var(--color-danger, #ef476f)",
          },
          ".cm-tooltip.cm-tooltip-lint": {
            backgroundColor: "var(--surface-elevated, #1e1e2e)",
            border: "1px solid var(--surface-border-light, #d0d0da)",
            borderRadius: "var(--radius-sm, 4px)",
            color: "var(--text-primary, #e0e0e0)",
            fontSize: "12px",
            padding: "4px 8px",
          },
          ".cm-panels": {
            backgroundColor: "var(--surface-elevated)",
            borderTop: "1px solid var(--surface-border-light)",
          },
          ".cm-panel": {
            color: "var(--text-primary)",
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Sync external value changes into the editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view || isInternalChange.current) return;
    const current = view.state.doc.toString();
    if (value !== current) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={editorRef} className={className} style={{ minHeight: 300 }} />;
}
