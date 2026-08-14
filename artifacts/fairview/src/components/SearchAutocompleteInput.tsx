import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, MapPin, Building, Tag, Home } from "lucide-react";
import { getSearchSuggestions, AutocompleteSuggestion } from "@/lib/search-engine";
import type { Property } from "@/lib/mock-data";

interface SearchAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (query: string) => void;
  properties: Property[];
  placeholder?: string;
  className?: string;
}

export function SearchAutocompleteInput({
  value,
  onChange,
  onSearch,
  properties,
  placeholder = "Search location, bedroom count, property type... (e.g. Ipetumodu, 4 bedroom, Fasina)",
  className = "",
}: SearchAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = getSearchSuggestions(properties, value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (s: AutocompleteSuggestion) => {
    onChange(s.text);
    setIsOpen(false);
    if (onSearch) {
      onSearch(s.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && onSearch) {
        onSearch(value);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (onSearch) {
        onSearch(value);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getIcon = (type: AutocompleteSuggestion["type"]) => {
    switch (type) {
      case "location":
        return <MapPin className="w-4 h-4 text-accent" />;
      case "category":
        return <Tag className="w-4 h-4 text-primary" />;
      case "property":
        return <Home className="w-4 h-4 text-blue-500" />;
      default:
        return <Building className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-12 pr-10 h-14 rounded-2xl bg-white border-gray-200 shadow-sm text-base md:text-lg focus-visible:ring-accent w-full"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-50">
            Suggested Matches
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {suggestions.map((item, index) => (
              <li
                key={`${item.type}-${item.text}-${index}`}
                onClick={() => handleSelectSuggestion(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                  index === selectedIndex ? "bg-accent/10 text-primary font-medium" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="p-2 rounded-lg bg-gray-50 shrink-0">{getIcon(item.type)}</span>
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{item.text}</p>
                    {item.subtext && <p className="text-xs text-muted-foreground truncate">{item.subtext}</p>}
                  </div>
                </div>
                <span className="text-xs text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10 shrink-0">
                  Select
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
