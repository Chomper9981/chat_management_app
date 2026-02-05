import React, { useState } from "react";
import "./CreateBot.css";
import AlignmentTextArea from "../components/dashBoardComponents/AlignmentTextArea.jsx";
import { ArrowLeftOutlined, InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Upload, Space, Card, Row, Col } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const CreateBot = () => {
  const navigate = useNavigate();
  const [botName, setBotName] = useState("");
  const [activeTab, setActiveTab] = useState("file"); // Default là 'Tập tin'

  return (
    <div className="create-bot-layout" style={{ padding: "20px" }}>
      {/* Điều hướng */}
      <div style={{ marginBottom: "20px" }}>
        <Text
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <ArrowLeftOutlined /> Danh sách trợ lý ảo /{" "}
          <span style={{ color: "#1890ff" }}>Tạo mới trợ lý ảo</span>
        </Text>
      </div>

      <Row gutter={[16, 24]}>
        <Col span={16}>
          {/* 1. Tên trợ lý ảo */}
          <div style={{ marginBottom: "16px" }}>
            <Text strong>Tên trợ lý ảo</Text>
            <Input
              placeholder="Nhập tên trợ lý ảo"
              maxLength={50}
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              status={botName.length === 0 ? "error" : ""}
            />
            {botName.length === 0 && (
              <Text type="danger" style={{ fontSize: "12px" }}>
                Không được để trống
              </Text>
            )}
            {/* 2. Giới hạn ký tự 0/50 */}
            <div style={{ textAlign: "right" }}>
              <Text type="secondary">{botName.length}/50</Text>
            </div>
          </div>

          {/* 3 & 4. Mô tả và Text field giới hạn 0/300 */}
          <div style={{ marginBottom: "16px" }}>
            <Text strong>Mô tả trợ lý ảo</Text>
            <TextArea
              placeholder="Nhập mô tả"
              maxLength={300}
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
            />
          </div>

          {/* 5. 3 nút cùng hàng */}
          <div style={{ marginBottom: "16px" }}>
            <Space>
              <Button 
                type={activeTab === "file" ? "primary" : "default"}
                onClick={() => setActiveTab("file")}
              >
                Tập tin
              </Button>
              <Button 
                type={activeTab === "web" ? "primary" : "default"}
                onClick={() => setActiveTab("web")}
              >
                Trang web
              </Button>
              <Button 
                type={activeTab === "text" ? "primary" : "default"}
                onClick={() => setActiveTab("text")}
              >
                Văn bản
              </Button>
            </Space>
          </div>

          {/* 6 & 7. Logic hiển thị Upload File */}
          {activeTab === "file" && (
            <div style={{ marginBottom: "16px" }}>
              <Text strong>File tải lên</Text>
              <Dragger
                name="file"
                multiple={true}
                accept=".docx,.doc,.pdf,.txt,.xlsx"
                beforeUpload={(file) => {
                  const isLt80M = file.size / 1024 / 1024 < 80;
                  if (!isLt80M) {
                    console.error("File phải nhỏ hơn 80MB");
                  }
                  return isLt80M || Upload.LIST_IGNORE;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click hoặc kéo thả file vào vùng này
                </p>
                <p className="ant-upload-hint">
                  Hệ thống chỉ hỗ trợ file với đuôi .docx, .doc, .pdf, .txt, .xlsx và kích thước dưới 80 MB
                </p>
              </Dragger>
            </div>
          )}

          {activeTab === "text" && (
            <AlignmentTextArea/>
          )}
        </Col>

        <Col span={8}>
          {/* 8. Box tracking dữ liệu */}
          <Card title="Nguồn dữ liệu huấn luyện" size="small">
            <div style={{ marginBottom: "8px" }}>
              <Text>0 file (0 ký tự)</Text>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text>0 text (0 ký tự)</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text>0 link (0 ký tự)</Text>
            </div>
            <hr style={{ border: "0.5px solid #f0f0f0" }} />
            <div style={{ marginTop: "16px" }}>
              <Text strong>Số lượng ký tự trong bộ dữ liệu</Text>
              <div style={{ marginTop: "4px" }}>
                <Text>0 / 10.000.000 limit</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateBot;