import React from "react";
import { Typography, Button, Select, Space, Divider, ColorPicker } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  ClearOutlined,
  CodeOutlined,
  BgColorsOutlined,
  FontColorsOutlined,
  EnterOutlined,
  SubnodeOutlined,
  SortDescendingOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import "./AlignmentTextArea.css";

const { Text } = Typography;

/* ---------- Custom Font Size Extension ---------- */
const FontSize = TextStyle.extend({
  name: "fontSize",
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

/* ---------- Custom Font Family Extension ---------- */
const FontFamily = TextStyle.extend({
  name: "fontFamily",
  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) return {};
          return { style: `font-family: ${attributes.fontFamily}` };
        },
      },
    };
  },
});

// THÊM sau FontFamily extension (trước dòng const AlignmentTextArea)
const Indent = TextStyle.extend({
  name: "indent",
  addAttributes() {
    return {
      textIndent: {
        default: null,
        parseHTML: (element) => element.style.textIndent,
        renderHTML: (attributes) => {
          if (!attributes.textIndent) return {};
          return { style: `text-indent: ${attributes.textIndent}` };
        },
      },
    };
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ commands }) => {
          return commands.updateAttributes("paragraph", {
            textIndent: "2em",
          });
        },
      outdent:
        () =>
        ({ commands }) => {
          return commands.updateAttributes("paragraph", {
            textIndent: "0em",
          });
        },
    };
  },
});

const AlignmentTextArea = ({ label, value, onChange }) => {
  const editor = useEditor({
    content: value,
    extensions: [
      TextStyle,
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      FontSize,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Indent,
    ],
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <Text strong>{label}</Text>}

      {/* ---------- TOOLBAR ---------- */}
      <Space
        wrap
        style={{
          margin: "8px 0",
          padding: 8,
          background: "#fafafa",
          borderRadius: 4,
        }}
      >
        {/* Heading Level */}
        <Select
          size="small"
          style={{ width: 100 }}
          value={
            editor.isActive("heading", { level: 1 })
              ? 1
              : editor.isActive("heading", { level: 2 })
                ? 2
                : "normal"
          }
          onChange={(v) =>
            v === "normal"
              ? editor.chain().focus().setParagraph().run()
              : editor.chain().focus().toggleHeading({ level: v }).run()
          }
          options={[
            { value: "normal", label: "Normal" },
            { value: 1, label: "H1" },
            { value: 2, label: "H2" },
          ]}
        />

        {/* Font Family */}
        <Select
          size="small"
          style={{ width: 120 }}
          placeholder="Font"
          onChange={(v) =>
            editor.chain().focus().setMark("textStyle", { fontFamily: v }).run()
          }
          options={[
            { value: "sans-serif", label: "Sans Serif" },
            { value: "serif", label: "Serif" },
            { value: "monospace", label: "Monospace" },
          ]}
        />

        {/* Font Size */}
        <Select
          size="small"
          style={{ width: 100 }}
          placeholder="Size"
          onChange={(v) =>
            editor.chain().focus().setMark("textStyle", { fontSize: v }).run()
          }
          options={[
            { value: "12px", label: "Small" },
            { value: "14px", label: "Normal" },
            { value: "18px", label: "Large" },
            { value: "24px", label: "Huge" },
          ]}
        />

        <Divider orientation="vertical" />

        {/* Text Formatting */}
        <Button
          size="small"
          type={editor.isActive("bold") ? "primary" : "default"}
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Button
          size="small"
          type={editor.isActive("italic") ? "primary" : "default"}
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Button
          size="small"
          type={editor.isActive("underline") ? "primary" : "default"}
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <Button
          size="small"
          type={editor.isActive("strike") ? "primary" : "default"}
          icon={<StrikethroughOutlined />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider orientation="vertical" />

        {/* Subscript & Superscript */}
        <Button
          size="small"
          type={editor.isActive("subscript") ? "primary" : "default"}
          icon={<SortAscendingOutlined />}
          title="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        />
        <Button
          size="small"
          type={editor.isActive("superscript") ? "primary" : "default"}
          icon={<SortDescendingOutlined />}
          title="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        />

        <Divider orientation="vertical" />

        {/* Text Alignment */}
        <Button
          size="small"
          type={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
          icon={<AlignLeftOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <Button
          size="small"
          type={
            editor.isActive({ textAlign: "center" }) ? "primary" : "default"
          }
          icon={<AlignCenterOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <Button
          size="small"
          type={editor.isActive({ textAlign: "right" }) ? "primary" : "default"}
          icon={<AlignRightOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
        <Button
          size="small"
          type={
            editor.isActive({ textAlign: "justify" }) ? "primary" : "default"
          }
          icon={<MenuOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        />

        <Divider orientation="vertical" />

        {/* Lists & Blocks */}
        <Button
          size="small"
          type={editor.isActive("orderedList") ? "primary" : "default"}
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Button
          size="small"
          type={editor.isActive("bulletList") ? "primary" : "default"}
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Button
          size="small"
          type={editor.isActive("blockquote") ? "primary" : "default"}
          icon={<EnterOutlined />}
          title="Block Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <Button
          size="small"
          type={editor.isActive("codeBlock") ? "primary" : "default"}
          icon={<CodeOutlined />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        <Divider orientation="vertical" />

        {/* Indent/Outdent */}
        <Button
          size="small"
          icon={<SubnodeOutlined style={{ transform: "rotate(180deg)" }} />}
          title="Indent (Lùi vào)"
          onClick={() => editor.chain().focus().indent().run()}
        />
        <Button
          size="small"
          icon={<SubnodeOutlined />}
          title="Outdent (Lùi ra)"
          onClick={() => editor.chain().focus().outdent().run()}
        />

        <Divider orientation="vertical" />

        {/* Colors */}
        <ColorPicker
          size="small"
          onChange={(_, hex) => editor.chain().focus().setColor(hex).run()}
          presets={[
            {
              label: "Colors",
              colors: [
                "#000000",
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF",
              ],
            },
          ]}
        >
          <Button
            size="small"
            icon={<FontColorsOutlined />}
            title="Text Color"
          />
        </ColorPicker>

        <ColorPicker
          size="small"
          onChange={(_, hex) =>
            editor.chain().focus().toggleHighlight({ color: hex }).run()
          }
          presets={[
            {
              label: "Highlight",
              colors: [
                "#FFFF00",
                "#00FF00",
                "#00FFFF",
                "#FF00FF",
                "#FFA500",
                "#FFB6C1",
              ],
            },
          ]}
        >
          <Button
            size="small"
            icon={<BgColorsOutlined />}
            title="Background Color"
          />
        </ColorPicker>

        <Divider orientation="vertical" />

        {/* Clear Formatting */}
        <Button
          size="small"
          danger
          icon={<ClearOutlined />}
          title="Tẩy toàn bộ hiệu ứng"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        />
      </Space>

      {/* ---------- EDITOR ---------- */}
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: 4,
          padding: 12,
          minHeight: 200,
          background: "#fff",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default AlignmentTextArea;
