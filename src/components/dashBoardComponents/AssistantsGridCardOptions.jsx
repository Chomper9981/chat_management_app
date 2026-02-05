import React from 'react'
import { CommentOutlined, MenuOutlined, MessageOutlined, RestOutlined, SettingOutlined, ShareAltOutlined, SolutionOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Dropdown } from 'antd';

const options = [
  {
    key: "1",
    label: "Trò chuyện với trợ lý ảo",
    icon: <CommentOutlined />,
  },
  {
    key: "2",
    label: "Cài đặt trợ lý ảo",
    icon: <SettingOutlined />,
  },
  {
    key: "3",
    label: "Huấn luyện trợ lý ảo",
    icon: <SolutionOutlined />
  },
  {
    key: "4",
    label: "Trò chuyện với khách hàng",
    icon: <MessageOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "5",
    label: "Chia sẻ",
    icon: <ShareAltOutlined />,
  },
  {
    key: "6",
    label: "Chuyển nhượng quyền sở hữu",
    icon: <SwapOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "7",
    label: "Xóa trợ lý ảo",
    icon: <RestOutlined />,
    danger: true,
  },
];


const AssistantsGridCardOptions = () => {
  return (
    <Dropdown
        trigger={["click"]}
        menu={{
          items: options,
        }}
      >
        <Button><MenuOutlined /></Button>
      </Dropdown>
  )
}

export default AssistantsGridCardOptions
