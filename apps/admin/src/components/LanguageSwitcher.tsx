import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuButton, MenuList, MenuItem, HStack, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language === 'tr' ? 'Türkçe' : 'English';
  };

  const getCurrentFlag = () => {
    return i18n.language === 'tr' ? '🇹🇷' : '🇺🇸';
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="ghost">
        <HStack spacing={2}>
          <Text>{getCurrentFlag()}</Text>
          <Text fontSize="sm">{getCurrentLanguage()}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => changeLanguage('en')}>
          <HStack spacing={2}>
            <Text>🇺🇸</Text>
            <Text>English</Text>
          </HStack>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('tr')}>
          <HStack spacing={2}>
            <Text>🇹🇷</Text>
            <Text>Türkçe</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
