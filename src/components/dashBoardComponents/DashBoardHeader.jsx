import { Button } from "antd";
import "./DashBoardHeader.css";

const DashBoardHeader = () => {
  return (
    <div className="dashboard-header-container">
      <Button type="primary">Trợ lý ảo</Button>
      <Button type="primary">Thông tin gói</Button>
      <Button type="primary">Lịch sử thanh toán</Button>
      <Button type="primary">Báo cáo</Button>
    </div>
  )
}

export default DashBoardHeader
