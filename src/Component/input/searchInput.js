import { memo } from "react";
import { FaSearch } from "react-icons/fa";
import "./style.css"

function SearchInput({ searchTerm, handleSearchChange, handleSearch, handleKeyDown, className }) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Ara..."
                className={`search-input ${className}`}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // handleKeyDown fonksiyonunu burada ekliyoruz
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
        </div>
    )
}

export default memo(SearchInput);