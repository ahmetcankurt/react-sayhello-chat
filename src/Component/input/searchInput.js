import { memo } from "react";
import { FaSearch } from "react-icons/fa";
import "./style.css"

function SearchInput({ searchTerm, handleSearchChange }) {
    return (
        <div className="search-container ">
            <input
                type="text"
                placeholder="Search..."
                className="search-input" 
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
        </div>
    )
}

export default memo(SearchInput)