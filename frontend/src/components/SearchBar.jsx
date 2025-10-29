import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  suggestions = [], 
  showSuggestions = true,
  className = "",
  size = "default" // small, default, large
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    default: "px-4 py-3 text-base",
    large: "px-6 py-4 text-lg"
  };

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered.slice(0, 5));
    setSelectedIndex(-1);
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setIsFocused(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsFocused(true);
  };

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`search-input ${sizeClasses[size]} pr-12`}
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setFilteredSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                index === selectedIndex ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="truncate">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {showSuggestions && isFocused && query === '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Recent Searches</h3>
          </div>
          <div className="p-2">
            {['Road Issues', 'Water Problems', 'Electricity Outage', 'Sanitation'].map((item, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;




