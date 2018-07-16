import React, { Component } from "react";
import { render } from "react-dom";
import {
  CompositeDecorator,
  EditorState,
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
import { stateFromHTML } from "draft-js-import-html";
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

class CommentBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      EmojiSelectIsOpen: false,
      suggestions: mentions,
      hasContent: false,
      imgSrc: "",
      imgSelected: false,
      isFocus: false,
      markdown: "no output"
    };

    const content = window.localStorage.getItem("content");
    if (content) {
      this.state.editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
  }

  onChange = editorState => {
    var that = this;
    that.state.hasContent = editorState.getCurrentContent().hasText()
      ? true
      : false;
    const contentState = editorState.getCurrentContent();
    that.saveContent(contentState);
    that.setState({ editorState });
  };

  saveContent = content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    });
  };

  focus = () => this.editor.focus();

  showMarkdown = () => {
    console.log("%cMy Output :", "color: yellow; font-size: x-large");
    var draftRaw = localStorage.getItem("content");

    /*let mentionConfig = {
      trigger: "@",
      separator: " "
    };*/
    //let markup = draftToMarkdown(JSON.parse(draftRaw), mentionConfig);
    let markup = draftToMarkdown(JSON.parse(draftRaw));

    const regex = /(^|\s)@([A-z,0-9]+)\b/gi;
    const subst = `$1[@$2]`;
    const result = markup.replace(regex, subst);

    console.log("markup :", result);
    this.setState({ markdown: result });
    //
  };

  editMsg = () => {
    var that = this;
    var sampleMarkup = document.getElementById("msg").innerHTML;
    console.log(sampleMarkup);
    let contentState = stateFromHTML(sampleMarkup);
    that.setState({ editorState: EditorState.createWithContent(contentState) });
    //that.focus();
    /*const decorator = new CompositeDecorator([
      {
        strategy: that.findLinkEntities,
        component: that.Link
      }
    ]);*/
    //var sampleMarkup = document.getElementById('msg').innerHTML;
    /*const sampleMarkup =
      '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
      '<a href="https://www.facebook.com">Example link</a><br /><br/ >' +
      '<img src="https://raw.githubusercontent.com/facebook/draft-js/master/examples/draft-0-10-0/convertFromHTML/image.png" height="112" width="200" />';
    const blocksFromHTML = convertFromHTML(sampleMarkup);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );       
    that.setState({ editorState: EditorState.createWithContent(state, decorator)});  
    that.focus();*/
  };

  render() {
    var that = this;
    const { MentionSuggestions } = mentionPlugin;
    return (
      <div>
        <p>
          <strong>Example input:</strong>
          <br />
          <small>
            Hi @juliandoesstuff and @nikgrafs , wish you #happynewyear 2018.
          </small>
        </p>
        <div
          onClick={that.focus}
          style={{
            textAlign: "center",
            border: "1px solid #333333",
            padding: 10,
            margin: 20
          }}
        >
          <Editor
            placeholder="Write a comment..."
            editorState={that.state.editorState}
            onChange={that.onChange}
            plugins={plugins}
            ref={element => {
              that.editor = element;
            }}
          />
        </div>
        <div
          onClick={that.showMarkdown}
          style={{
            border: "1px solid red",
            fontSize: 12,
            backgroundColor: "rgba(0,0,0,0.15)",
            padding: 4,
            borderRadius: 4,
            width: 150
          }}
        >
          Generate Markdown
        </div>

        <div>
          <p>
            <strong>My output:</strong>
            <br />
            {that.state.markdown}
          </p>
        </div>

        <div>
          <p>
            <strong>Edit this HTML:</strong>
            <br />
            <span id="msg">
              Hi <a href="juliandoesstuff">@juliandoesstuff</a> and{" "}
              <a href="nikgrafs">@nikgrafs</a> , wish you{" "}
              <a href="#happynewyear">#happynewyear</a> 2018.
            </span>
          </p>
        </div>
        <div
          onClick={that.editMsg}
          style={{
            border: "1px solid red",
            fontSize: 12,
            backgroundColor: "rgba(0,0,0,0.15)",
            padding: 4,
            borderRadius: 4,
            width: 150
          }}
        >
          Edit Content
        </div>
        <div
          style={{
            width: "100vw",
            display: "block",
            fontSize: 14,
            overflow: "hidden",
            padding: 10
          }}
        >
          <MentionSuggestions
            onSearchChange={that.onSearchChange}
            suggestions={that.state.suggestions}
            entryComponent={Entry}
          />
        </div>

        <div />
      </div>
    );
  }
}
//export default ({ name }) => <h1>Hello {name}!</h1>;
export default CommentBox;

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
            alt=""
            width={50}
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
      <div />
    </div>
  );
};
