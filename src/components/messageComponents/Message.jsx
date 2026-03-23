import { CopyOutlined, DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./Message.css";
import { message as antMessage, Tooltip } from "antd";

const Message = ({ type, text, avatar, timestamp }) => {
  const isSent = type === "sent";

  // Pre-process text to convert LaTeX-style delimiters to standard markdown math delimiters
  const preprocessText = (content) => {
    if (!content) return "";
    return content
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$");
  };

  const processedText = preprocessText(text);

  return (
    <div className={`message-row ${type}`}>
      {!isSent && avatar && (
        <img src={avatar} alt="avatar" className="message-avatar" />
      )}

      <div className="message-bubble">
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
          >
            {processedText}
          </ReactMarkdown>
        </div>
        <div className="message-footer">
          <div className="message-actions">
            <span className="message-time">{timestamp}</span>
            {!isSent && (
              <Tooltip title="Sao chép">
                <CopyOutlined
                  className="message-action-icon"
                  onClick={() => {
                    navigator.clipboard.writeText(text);
                    antMessage.success("Đã sao chép vào bộ nhớ tạm");
                  }}
                />
              </Tooltip>
            )}
          </div>
          {!isSent && (
            <div className="message-actions">
              <LikeOutlined className="message-action-icon" />
              <DislikeOutlined className="message-action-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
