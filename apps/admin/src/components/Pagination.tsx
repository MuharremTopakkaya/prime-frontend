import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    const maxVisiblePages = isMobile ? 3 : 5; // Mobilde daha az sayfa göster
    
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
    <Flex 
      justify="space-between" 
      align="center" 
      mt={6}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 3, md: 0 }}
    >
      <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
        {t('pagination.showing')} {(currentPage * 10) + 1} {t('pagination.to')} {Math.min((currentPage + 1) * 10, totalRecords)} {t('pagination.of')} {totalRecords} {t('pagination.entries')}
      </Text>
      
      <HStack spacing={{ base: 1, md: 2 }}>
        <IconButton
          aria-label={t('pagination.previous')}
          icon={<ChevronLeftIcon />}
          size={{ base: "xs", md: "sm" }}
          variant="outline"
          isDisabled={!hasPrevious}
          onClick={handlePrevious}
        />
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            size={{ base: "xs", md: "sm" }}
            variant={page === currentPage ? 'solid' : 'outline'}
            colorScheme={page === currentPage ? 'blue' : 'gray'}
            onClick={() => onPageChange(page)}
            minW={{ base: "32px", md: "40px" }}
          >
            {page + 1}
          </Button>
        ))}
        
        <IconButton
          aria-label={t('pagination.next')}
          icon={<ChevronRightIcon />}
          size={{ base: "xs", md: "sm" }}
          variant="outline"
          isDisabled={!hasNext}
          onClick={handleNext}
        />
      </HStack>
    </Flex>
  );
};

export default Pagination;
