import { useState, useEffect } from "react";
import "./Dropdown.css";
import PropTypes from "prop-types";

function Dropdown({ onCommunitySelect }) {
  const [isOpen, setIsOpen] = useState(true); // Keep dropdown open by default
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (communityId, e) => {
    e.stopPropagation();
    setSelectedCommunity(communityId);
    onCommunitySelect(communityId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://qw95sssgu5.execute-api.us-east-1.amazonaws.com/large-prd/get-cdr-data-communities-api"
        );
        const result = await response.json();
        const data = JSON.parse(result.body);
        const formattedData = Object.entries(data).map(([key, value]) => ({
          communityId: key,
          size: value.size,
        }));
        setOptions(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="custom-dropdown" onClick={toggleDropdown}>
        <div className="selected-option">
          {/* Always show "Select community" regardless of loading state */}
          Select community
          <span className="dropdown-arrow"></span>
        </div>

        {/* Options section is loaded as soon as the page mounts */}
        {isOpen && (
          <div className="options">
            {/* Show "Loading" until the data is fetched */}
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              options.map((option) => (
                <div
                  key={option.communityId}
                  className={`option ${
                    selectedCommunity === option.communityId ? "selected" : ""
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="option-text">
                    {option.communityId}
                    <br />
                    Size: {option.size}
                  </div>
                  <button
                    onClick={(e) => handleButtonClick(option.communityId, e)}
                    className="option-button"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Dropdown.propTypes = {
  onCommunitySelect: PropTypes.func.isRequired,
};

export default Dropdown;
