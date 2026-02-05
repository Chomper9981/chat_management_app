import React, { useState } from "react";
import ToolsBar from "./ToolsBar.jsx";
import AssistantsGrid from "./AssistantsGrid.jsx";
import AssistantsList from "./AssistantsList.jsx";
import { Pagination } from "antd";
import Data from "./mocks/mockData.js";

const AssistantsContainers = () => {
  const [isGridView, setIsGridView] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleViewChange = (newView) => {
    setIsGridView(newView);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính toán index bắt đầu và kết thúc
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lấy data cho trang hiện tại
  const currentData = Data.slice(startIndex, endIndex);

  return (
    <div>
      <ToolsBar setIsGridView={handleViewChange} isGridView={isGridView} />
      {!isGridView ? (
        <AssistantsList data={currentData} />
      ) : (
        <AssistantsGrid data={currentData} />
      )}
      <Pagination
        style={{ marginTop: "20px"}}
        align="center"
        current={currentPage}
        pageSize={itemsPerPage}
        total={Data.length}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default AssistantsContainers;
