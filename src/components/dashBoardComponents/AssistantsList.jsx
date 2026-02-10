import { Table } from "antd";
import { Avatar, Space, Typography } from "antd";
import AssistantsGridCardOptions from "./AssistantsGridCardOptions.jsx";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const AssistantsList = ({ data }) => {
  const navigate = useNavigate();
  const handleCardClick = (data) => {
    navigate(`/dashboard/chatbot/${data.id}?message=new`);
  };
  
  const columns = [
    {
      title: "Tên trợ lý ảo",
      dataIndex: "name",
      key: "name",
      render: (_value, data) => (
        <Space onClick={() => handleCardClick(data)} style={{ cursor: 'pointer' }}>
          <Avatar src={data?.avatar} />
          <span>{data?.name || "Không có tiêu đề"}</span>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_value, data) => (
        <div>
          {!data?.status ? (
            <Text className="card-status-active">Hoạt động</Text>
          ) : (
            <Text className="card-status-inactive">Không hoạt động</Text>
          )}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      render: () => <AssistantsGridCardOptions />,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false}/>
    </div>
  );
};

export default AssistantsList;
