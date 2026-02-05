import { Col, Row, Empty } from "antd";
import AssistantsGridCard from "./AssistantsGridCard.jsx";

const AssistantsGrid = ({ data }) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {data && data.length > 0 ? (
          data.map((item) => (
            <Col
              key={item.id}
              xs={24} // Mobile: 1 cột
              sm={12} // Tablet: 2 cột
              lg={6} // Desktop: 4 cột
          >
            {!item ? <Empty /> : <AssistantsGridCard data={item} />}
          </Col>
        ))) : (
          <Col span={24}>
            <Empty description="Không có trợ lý ảo nào" />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AssistantsGrid;
