import { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

export default function SearchBar({
  onSearch,
}) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch?.({
      keyword,
    });
  };

  return (
    <div style={{ width: '100%', padding: '16px' }}>
      <Search
        placeholder="Nhập từ khóa..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={handleSearch}
        allowClear
        style={{ width: '100%' }}
      />
    </div>
  );
}