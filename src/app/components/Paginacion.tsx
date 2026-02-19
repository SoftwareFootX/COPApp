import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: number[] = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-full
                   border border-gray-300 text-gray-600
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition cursor-pointer"
      >
        <FiChevronLeft />
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-full text-sm font-medium transition cursor-pointer
            ${
              page === currentPage
                ? "bg-primary text-white shadow"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-full
                   border border-gray-300 text-gray-600
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition cursor-pointer"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export { Pagination };
