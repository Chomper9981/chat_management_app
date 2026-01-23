import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ onSearch, placeholder = "Tìm kiếm..." }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    console.log("Search:", value);
    onSearch?.(value);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    // todo: real-time search
    onSearch?.(e.target.value);
  };

  return (
    <div style={{ padding: "8px" }}>
      <Search
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onSearch={handleSearch}
        allowClear
        enterButton={false}
      />
    </div>
  );
};

export default SearchBar;
