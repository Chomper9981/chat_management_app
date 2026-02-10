import AssistantsGridCardOptions from "./AssistantsGridCardOptions";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./AssistantsGridCard.css";

const { Text } = Typography;
const AssistantsGridCard = ({ data }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/dashboard/chatbot/${data.id}?message=new`);
  };
  return (
    <div className="card-container">
      <div className="card-options-row">
        <AssistantsGridCardOptions />
      </div>
      <span className="card-name-row">
        <a onClick={handleCardClick}>{data?.name || "Không có tiêu đề"}</a>
      </span>
      <div className="card-avatar-row">
        <img onClick={handleCardClick} style={{ cursor: 'pointer' }} src={data?.avatar} alt="Assistant" />
      </div>
      <div className="card-info-row">
        <span className="card-info-label">Mô tả:</span>
        <Text className="card-info-value">
          {data?.description || "Không có mô tả"}
        </Text>
      </div>
      <div className="card-info-row">
        <span className="card-info-label">Trạng thái:</span>
        {!data?.status ? (
          <Text className="card-status-active">Hoạt động</Text>
        ) : (
          <Text className="card-status-inactive">Không hoạt động</Text>
        )}
      </div>
      <div className="card-info-row">
        <span className="card-info-label">Ngày tạo:</span>
        <Text className="card-info-value">{data?.createdAt || "Không rõ"}</Text>
      </div>
    </div>
  );
};

export default AssistantsGridCard;
