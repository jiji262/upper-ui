// src/components/ui/navigation/Pagination/Pagination.tsx
import React, { useState, useEffect } from 'react';
import Icon from '../../general/Icon'; // Assuming Icon component is available
import Select from '../../data-entry/Select'; // Assuming a Select component is available for pageSize changer
import './Pagination.css';


// Interface for Select component's option (simplified)
interface SelectOption {
    value: string | number;
    label: string | React.ReactNode;
}


interface PaginationProps {
  total: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[] | number[]; // e.g. ['10', '20', '50']
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  simple?: boolean; // Simplified mode
  disabled?: boolean;
  itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactNode) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  locale?: { // For internationalization, simplified
    prevText?: string;
    nextText?: string;
    jumpTo?: string;
    page?: string;
    items_per_page?: string;
  };
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  current: controlledCurrent,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  onChange,
  onShowSizeChange,
  showSizeChanger = false,
  pageSizeOptions = ['10', '20', '50', '100'],
  showQuickJumper = false,
  showTotal,
  simple = false,
  disabled = false,
  itemRender,
  className,
  style,
  locale = { items_per_page: '/ page', jumpTo: 'Go to', page: ''},
}) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrent);
  const [currentPageSize, setCurrentPageSize] = useState(defaultPageSize);
  const [jumpValue, setJumpValue] = useState('');


  useEffect(() => {
    if (controlledCurrent !== undefined) {
      setCurrentPage(controlledCurrent);
    }
  }, [controlledCurrent]);

  useEffect(() => {
    if (controlledPageSize !== undefined) {
      setCurrentPageSize(controlledPageSize);
    }
  }, [controlledPageSize]);
  
  const totalPages = Math.ceil(total / currentPageSize);

  const handleChangePage = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    if (controlledCurrent === undefined) {
      setCurrentPage(page);
    }
    onChange?.(page, currentPageSize);
  };

  const handlePageSizeChange = (value: string | number) => {
    const newPageSize = Number(value);
    if (disabled) return;

    // When page size changes, current page might need to adjust
    const newCurrentPage = Math.min(currentPage, Math.ceil(total / newPageSize));
    if (newCurrentPage !== currentPage) {
        if (controlledCurrent === undefined) setCurrentPage(newCurrentPage);
    }

    if (controlledPageSize === undefined) {
      setCurrentPageSize(newPageSize);
    }
    onShowSizeChange?.(newCurrentPage, newPageSize);
    onChange?.(newCurrentPage, newPageSize); // Also trigger onChange as current page might change
  };

  const handleJump = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    const pageNumber = parseInt(jumpValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handleChangePage(pageNumber);
    }
    setJumpValue(''); // Clear input after jump
  };

  const renderItem = (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: React.ReactNode) => {
    if (itemRender) {
      return itemRender(page, type, originalElement);
    }
    return originalElement;
  };

  const prevClasses = ['ant-pagination-prev', currentPage <= 1 || disabled ? 'ant-pagination-disabled' : ''].join(' ');
  const nextClasses = ['ant-pagination-next', currentPage >= totalPages || disabled ? 'ant-pagination-disabled' : ''].join(' ');

  if (simple) {
    return (
      <ul className={`ant-pagination ant-pagination-simple ${disabled ? 'ant-pagination-disabled' : ''} ${className || ''}`} style={style}>
        <li title={locale.prevText || 'Previous Page'} className={prevClasses} onClick={() => handleChangePage(currentPage - 1)}>
          {renderItem(currentPage -1, 'prev', <button className="ant-pagination-item-link" type="button" disabled={disabled || currentPage <= 1}><Icon name="LeftOutlined" /></button>)}
        </li>
        <li className="ant-pagination-simple-pager">
          <input type="text" value={currentPage} disabled={disabled} onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              // Allow direct input for simple mode, then jump on blur or enter (not fully implemented here)
              if(!isNaN(val)) setCurrentPage(val); // Basic update
          }} 
          onBlur={() => handleChangePage(currentPage)} // Trigger change on blur
          onKeyDown={(e) => e.key === 'Enter' && handleChangePage(currentPage)}
          />
          <span className="ant-pagination-slash">/</span>
          {totalPages}
        </li>
        <li title={locale.nextText || 'Next Page'} className={nextClasses} onClick={() => handleChangePage(currentPage + 1)}>
          {renderItem(currentPage + 1, 'next', <button className="ant-pagination-item-link" type="button" disabled={disabled || currentPage >= totalPages}><Icon name="RightOutlined" /></button>)}
        </li>
      </ul>
    );
  }

  const pageNumbers: React.ReactNode[] = [];
  const pageBufferSize = 2; // Number of pages to show around current page
  let showPrevMore = false;
  let showNextMore = false;

  if (totalPages <= 5 + pageBufferSize * 2) { // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          title={String(i)}
          className={`ant-pagination-item ${currentPage === i ? 'ant-pagination-item-active' : ''} ${disabled ? 'ant-pagination-disabled' : ''}`}
          onClick={() => handleChangePage(i)}
        >
          {renderItem(i, 'page', <a>{i}</a>)}
        </li>
      );
    }
  } else {
    // Logic for ellipsis (...)
    // Add first page
    pageNumbers.push(
      <li key={1} title="1" className={`ant-pagination-item ${currentPage === 1 ? 'ant-pagination-item-active' : ''} ${disabled ? 'ant-pagination-disabled' : ''}`} onClick={() => handleChangePage(1)}>
        {renderItem(1, 'page', <a>1</a>)}
      </li>
    );

    // Ellipsis after first page
    if (currentPage > pageBufferSize + 2) {
      showPrevMore = true;
      pageNumbers.push(
        <li key="prev-more" title="Previous 5 Pages" className={`ant-pagination-jump-prev ${disabled ? 'ant-pagination-disabled' : ''}`} onClick={() => handleChangePage(Math.max(1, currentPage - 5))}>
          {renderItem(Math.max(1, currentPage - 5), 'jump-prev', <button className="ant-pagination-item-link" type="button"> <Icon name="EllipsisOutlined" /></button>)}
        </li>
      );
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - pageBufferSize);
    const endPage = Math.min(totalPages - 1, currentPage + pageBufferSize);

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue; // Skip if already added
      pageNumbers.push(
        <li key={i} title={String(i)} className={`ant-pagination-item ${currentPage === i ? 'ant-pagination-item-active' : ''} ${disabled ? 'ant-pagination-disabled' : ''}`} onClick={() => handleChangePage(i)}>
          {renderItem(i, 'page', <a>{i}</a>)}
        </li>
      );
    }

    // Ellipsis before last page
    if (currentPage < totalPages - pageBufferSize - 1) {
      showNextMore = true;
      pageNumbers.push(
        <li key="next-more" title="Next 5 Pages" className={`ant-pagination-jump-next ${disabled ? 'ant-pagination-disabled' : ''}`} onClick={() => handleChangePage(Math.min(totalPages, currentPage + 5))}>
           {renderItem(Math.min(totalPages, currentPage + 5), 'jump-next', <button className="ant-pagination-item-link" type="button"> <Icon name="EllipsisOutlined" /></button>)}
        </li>
      );
    }
    
    // Add last page (if not already added)
    if (totalPages > 1) {
        pageNumbers.push(
          <li key={totalPages} title={String(totalPages)} className={`ant-pagination-item ${currentPage === totalPages ? 'ant-pagination-item-active' : ''} ${disabled ? 'ant-pagination-disabled' : ''}`} onClick={() => handleChangePage(totalPages)}>
            {renderItem(totalPages, 'page', <a>{totalPages}</a>)}
          </li>
        );
    }
  }


  return (
    <ul className={`ant-pagination ${disabled ? 'ant-pagination-disabled' : ''} ${className || ''}`} style={style}>
      {showTotal && (
        <li className="ant-pagination-total-text">
          {showTotal(total, [(currentPage - 1) * currentPageSize + 1, Math.min(currentPage * currentPageSize, total)])}
        </li>
      )}
      <li title={locale.prevText || 'Previous Page'} className={prevClasses} onClick={() => handleChangePage(currentPage - 1)}>
         {renderItem(currentPage -1, 'prev', <button className="ant-pagination-item-link" type="button" disabled={disabled || currentPage <= 1}><Icon name="LeftOutlined" /></button>)}
      </li>
      {pageNumbers}
      <li title={locale.nextText || 'Next Page'} className={nextClasses} onClick={() => handleChangePage(currentPage + 1)}>
        {renderItem(currentPage + 1, 'next', <button className="ant-pagination-item-link" type="button" disabled={disabled || currentPage >= totalPages}><Icon name="RightOutlined" /></button>)}
      </li>
      {showSizeChanger && Select && ( // Check if Select component is available
        <li className="ant-pagination-options">
          <Select
            disabled={disabled}
            value={String(currentPageSize)}
            onChange={(optionValue) => handlePageSizeChange(optionValue as string | number)}
            options={pageSizeOptions.map(size => ({ value: String(size), label: `${size} ${locale.items_per_page}` }))}
            // This assumes Select has a certain API, adjust if needed
            // size="small" // AntD pagination select is usually small
            className="ant-pagination-options-size-changer"
          />
        </li>
      )}
      {showQuickJumper && (
        <li className="ant-pagination-options-quick-jumper">
          {locale.jumpTo}
          <input type="text" value={jumpValue} disabled={disabled} onChange={(e) => setJumpValue(e.target.value)} onKeyDown={handleJump} />
          {locale.page}
        </li>
      )}
    </ul>
  );
};

export default Pagination;
