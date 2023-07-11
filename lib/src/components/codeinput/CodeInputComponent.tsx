import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { MySQL, PostgreSQL, sql } from "@codemirror/lang-sql";
import {
  foldGutter as foldGutterExtension,
  StreamLanguage,
} from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import { linter } from "@codemirror/lint";
import { Card as MantineCard, Input as MantineInput } from "@mantine/core";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Ref, useMemo } from "react";

import { useStyles } from "./CodeInput.styles";
import { CodeInputComponentPropsBase } from "./CodeInput.types";
import { dracula, github } from "./themes";

/**
 * Presentational code input component.
 */
const CodeInputComponent = ({
  placeholder,
  label,
  description,
  error,
  disabled,
  value,
  language,
  lineNumbers = false,
  foldGutter = false,
  theme = "light",
  className,
  style,
  innerRef,
  required,
  onChange,
}: CodeInputComponentPropsBase & {
  innerRef: Ref<ReactCodeMirrorRef>;
  required?: boolean;
  onChange: (v: string) => void;
}) => {
  const extensions = useMemo(
    () => getExtensions(language, foldGutter),
    [language, foldGutter],
  );

  const hasGutters = lineNumbers || foldGutter;
  const styles = useStyles();

  return (
    <MantineInput.Wrapper
      label={label}
      withAsterisk={required}
      error={error}
      description={description}
    >
      <MantineCard
        unstyled
        withBorder
        className={theme === "dark" ? styles.classes.darkColors : undefined}
      >
        {/* MantineCard.Section needed to override native Card padding */}
        <MantineCard.Section
          className={
            hasGutters
              ? styles.classes.guttersPadding
              : styles.classes.noGuttersPadding
          }
        >
          <CodeMirror
            className={className}
            style={{
              minHeight: 54,
              overflowY: "auto",
              ...style,
            }}
            ref={innerRef}
            value={value}
            onChange={(value, viewUpdate) => {
              onChange?.(value);
            }}
            editable={!disabled}
            placeholder={placeholder}
            basicSetup={{
              lineNumbers,
              foldGutter: false,
              bracketMatching: true,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              autocompletion: false,
            }}
            extensions={extensions}
            theme={theme === "light" ? github : dracula}
          />
        </MantineCard.Section>
      </MantineCard>
    </MantineInput.Wrapper>
  );
};

CodeInputComponent.displayName = "CodeInput";

const getExtensions = (language?: string, foldGutter?: boolean) => {
  const extensions = [autocompletion({ icons: false })];
  if (foldGutter) {
    extensions.push(foldGutterExtension({ openText: "▾", closedText: "▸" }));
  }
  switch (language) {
    case "sql":
      extensions.push(sql());
      break;
    case "mysql":
      extensions.push(sql({ dialect: MySQL }));
      break;
    case "pgsql":
      extensions.push(sql({ dialect: PostgreSQL }));
      break;
    case "json":
      extensions.push(json());
      extensions.push(linter(jsonParseLinter()));
      break;
    case "javascript":
      extensions.push(javascript());
      break;
    case "jsx":
      extensions.push(javascript({ jsx: true }));
      break;
    case "typescript":
      extensions.push(javascript({ typescript: true }));
      break;
    case "tsx":
      extensions.push(javascript({ jsx: true, typescript: true }));
      break;
    case "yaml":
      extensions.push(StreamLanguage.define(yaml));
      break;
    default:
      break;
  }

  return extensions;
};

export default CodeInputComponent;
