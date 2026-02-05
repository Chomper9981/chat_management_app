import React, { useState } from "react";
import { Input, Button, Radio, Space, Dropdown } from "antd";
import { TableOutlined, BarsOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ToolsBar.css";

const { Search } = Input;
const sort = [
  {
    key: "0",
    label: "Mặc định",
  },
  {
    key: "1",
    label: "A-Z",
  },
  {
    key: "2",
    label: "Z-A",
  },
];

const ToolsBar = ({ setIsGridView, isGridView }) => {
  const onSearch = (value) => console.log(value);
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("0");
  return (
    <div className="toolbar-container">
      <span className="toolbar-title">Danh sách các trợ lý ảo</span>
      <div className="toolbar-right-section">
        <Search
          className="toolbar-search"
          placeholder="Tìm kiếm trợ lý ảo"
          onSearch={onSearch}
          enterButton
        />
        <Dropdown
          menu={{
            items: sort,
            onClick: ({ key }) => {
              setSelectedKey(key);
            },
          }}
        >
          <Button
            className="toolbar-sort-dropdown"
            icon={<DownOutlined />}
            iconPlacement="end"
          >
            {sort[Number(selectedKey)].label}
          </Button>
        </Dropdown>
        <Button type="primary" onClick={() => navigate("/dashboard/create-bot")}>Thêm trợ lý ảo</Button>
        <Space>
          <Radio.Group
            value={isGridView ? "grid" : "list"}
            onChange={(e) => setIsGridView(e.target.value === "grid")}
          >
            <Radio.Button value="grid">
              <TableOutlined />
            </Radio.Button>
            <Radio.Button value="list">
              <BarsOutlined />
            </Radio.Button>
          </Radio.Group>
        </Space>
      </div>
    </div>
  );
};

export default ToolsBar;
