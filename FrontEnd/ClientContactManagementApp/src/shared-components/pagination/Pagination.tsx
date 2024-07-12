import React from 'react';
import './Pagination.css'; // Ensure correct path to your CSS file

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const range = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="pagination-container">
            <ul className="pagination">
                {range(1, totalPages).map((page) => (
                    <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pagination;
