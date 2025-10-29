import React, { useState, useEffect, useRef } from 'react';

const EnhancedSearchBar = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  className = "",
  debounceMs = 300
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.trim()) {
      setIsLoading(true);
      debounceTimeout.current = setTimeout(() => {
        performSearch();
        setIsLoading(false);
      }, debounceMs);
    } else {
      setFilteredSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch();
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Elegant Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors duration-300 ${
                isFocused ? 'text-violet-500' : 'text-gray-400'
              }`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-lg bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl"
            aria-label="Search"
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-200 border-t-violet-600"></div>
            </div>
          )}

          {/* Clear Button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilteredSuggestions([]);
                if (onSearch) onSearch('');
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          {!query && !isLoading && (
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-violet-500 transition-colors duration-200"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Elegant Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-violet-50/80 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl focus:bg-violet-50/80 focus:outline-none group"
            >
              <div className="flex items-center space-x-3">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && query && filteredSuggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4">
          <p className="text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
