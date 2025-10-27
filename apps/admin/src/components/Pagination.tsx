import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  Button,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  hasPrevious,
  hasNext,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return (
      <Flex justify="center" mt={4}>
        <Text color="gray.500" fontSize="sm">
          {t('pagination.totalRecords')}: {totalRecords}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex justify="space-between" align="center" mt={6}>
      <Text color="gray.500" fontSize="sm">
        {t('pagination.showing')} {(currentPage * 10) + 1} {t('pagination.to')} {Math.min((currentPage + 1) * 10, totalRecords)} {t('pagination.of')} {totalRecords} {t('pagination.entries')}
      </Text>
      
      <HStack spacing={2}>
        <IconButton
          aria-label={t('pagination.previous')}
          icon={<ChevronLeftIcon />}
          size="sm"
          variant="outline"
          isDisabled={!hasPrevious}
          onClick={handlePrevious}
        />
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? 'solid' : 'outline'}
            colorScheme={page === currentPage ? 'blue' : 'gray'}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </Button>
        ))}
        
        <IconButton
          aria-label={t('pagination.next')}
          icon={<ChevronRightIcon />}
          size="sm"
          variant="outline"
          isDisabled={!hasNext}
          onClick={handleNext}
        />
      </HStack>
    </Flex>
  );
};

export default Pagination;
