import React from "react";
import { render } from "react-dom";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "draft-js-mention-plugin";
import draftToMarkdown from "draftjs-to-markdown";
import "draft-js-mention-plugin/lib/plugin.css";
import "draft-js-hashtag-plugin/lib/plugin.css";
import editorStyles from "./editorStyles.css";
import mentionsStyles from "./mentionsStyles.css";
import mentions from "./mentions";
import Hello from "./Hello";

const hashtagPlugin = createHashtagPlugin();

const positionSuggestions = ({ state, props }) => {
  let transform;
  let transition;

  if (state.isActive && props.suggestions.size > 0) {
    transform = "scaleY(1)";
    transition = "all 0.25s cubic-bezier(.3,1.2,.2,1)";
  } else if (state.isActive) {
    transform = "scaleY(0)";
    transition = "all 0.25s cubic-bezier(.3,1,.2,1)";
  }

  return {
    transform,
    transition
  };
};

const mentionPlugin = createMentionPlugin({
  mentions,
  entityMutability: "IMMUTABLE",
  theme: mentionsStyles,
  positionSuggestions,
  mentionPrefix: " @"
});

const plugins = [hashtagPlugin, mentionPlugin];

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Start editing to see some magic happen {"\u2728"}</h2>
  </div>
);

render(<App />, document.getElementById("root"));



const Entry = props => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    isFocused, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.get("avatar")}
            className={theme.mentionSuggestionsEntryAvatar}
          />
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>
            {mention.get("name")}
          </div>

          <div className={theme.mentionSuggestionsEntryTitle}>
            {mention.get("title")}
          </div>
        </div>
      </div>
    </div>
  );
};
