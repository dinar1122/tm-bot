import React, { useState } from 'react';

export const Pagination = ({ currentPage, totalPages, onPageChange }:any) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const handleInputChange = (e: any) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e: any) => {
    if (e.key === 'Enter' && inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(Number(inputPage));
    }
  };

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPages = () => {
    if (totalPages <= 35) {
      return pageNumbers.map((number) => (
        <li key={number}>
          <button
            onClick={() => onPageChange(number)}
            className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            {number}
          </button>
        </li>
      ));
    } else {
      const startPages = pageNumbers.slice(0, 10);
      const endPages = pageNumbers.slice(-10);

      return (
        <>
          {startPages.map((number) => (
            <li key={number}>
              <button
                onClick={() => onPageChange(number)}
                className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className="flex items-center p-3">
            <input
              type="number"
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              min={1}
              max={totalPages}
            />
          </li>
          {endPages.map((number) => (
            <li key={number}>
              <button
                onClick={() => onPageChange(number)}
                className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {number}
              </button>
            </li>
          ))}
        </>
      );
    }
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px text-base h-10">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Previous
          </button>
        </li>
        {renderPages()}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

