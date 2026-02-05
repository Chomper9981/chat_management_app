import "./DashBoard.css";
import DashBoardHeader from "../components/dashBoardComponents/DashBoardHeader.jsx";
import AssitantsContainers from "../components/dashBoardComponents/AssistantsContainers.jsx";

const DashBoard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-content">
        <DashBoardHeader />
        <AssitantsContainers />
      </div>
    </div>
  );
};

export default DashBoard;
