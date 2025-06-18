"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "use-debounce";

interface Product {
  id: string;
  name: string;
  price: number;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    async function fetchProducts() {
      try {
        const response = await fetch(
          `/api/product/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        if (response.ok) {
          setSuggestions(data.products || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setSuggestions([]);
      }
    }

    fetchProducts();
  }, [debouncedQuery]);

  return (
    <div className=" w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <CiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Bạn cần tìm gì..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {/* Suggestions Dropdown */}
      {query && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {suggestions.map((product, index) => (
            <Link
              key={index}
              href={`/product/${product.name}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setQuery("")} // Clear query on click
            >
              <div className="text-sm font-medium">{product.name}</div>
            </Link>
          ))}
        </div>
      )}
      {query && suggestions.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-500 z-10">
          Tên sản phẩm không hợp lệ
        </div>
      )}
    </div>
  );
};

export default SearchBar;
