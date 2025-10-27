import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Checkbox,
  IconButton,
  Tooltip,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { userService, UserClaimsGroup, UserClaim } from '../services/userService';

interface UserClaimsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const UserClaimsSidebar: React.FC<UserClaimsSidebarProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [claimsGroups, setClaimsGroups] = useState<UserClaimsGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaims, setSelectedClaims] = useState<Set<number>>(new Set());
  const [hasFullControl, setHasFullControl] = useState(false);

  // Fetch user claims
  const fetchUserClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserClaims(userId);
      
      // Sort groups - FullControl first if exists
      const sortedGroups = data.sort((a, b) => {
        if (a.group === 'FullControl') return -1;
        if (b.group === 'FullControl') return 1;
        return a.group.localeCompare(b.group);
      });
      
      setClaimsGroups(sortedGroups);
      
      // Set initial selected claims
      const assignedClaims = new Set<number>();
      let fullControlSelected = false;
      
      sortedGroups.forEach(group => {
        group.claims.forEach(claim => {
          if (claim.isAssigned) {
            assignedClaims.add(claim.id);
            if (group.group === 'FullControl') {
              fullControlSelected = true;
            }
          }
        });
      });
      
      setSelectedClaims(assignedClaims);
      setHasFullControl(fullControlSelected);
    } catch (err) {
      console.error('Error fetching user claims:', err);
      setError('Failed to load user claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserClaims();
    }
  }, [isOpen, userId]);

  // Handle claim selection
  const handleClaimChange = (claimId: number, isChecked: boolean, group: string) => {
    const newSelectedClaims = new Set(selectedClaims);
    
    if (group === 'FullControl') {
      if (isChecked) {
        // Select FullControl and deselect all others
        newSelectedClaims.clear();
        newSelectedClaims.add(claimId);
        setHasFullControl(true);
      } else {
        // Deselect FullControl
        newSelectedClaims.delete(claimId);
        setHasFullControl(false);
      }
    } else {
      if (isChecked) {
        // Check if this is an Admin claim
        const groupData = claimsGroups.find(g => g.group === group);
        const claim = groupData?.claims.find(c => c.id === claimId);
        
        if (claim?.name.includes('.Admin')) {
          // Admin claim selected - deselect other claims in this group
          groupData?.claims.forEach(c => {
            if (c.id !== claimId) {
              newSelectedClaims.delete(c.id);
            }
          });
        } else {
          // Regular claim selected - deselect Admin claim in this group
          const adminClaim = groupData?.claims.find(c => c.name.includes('.Admin'));
          if (adminClaim) {
            newSelectedClaims.delete(adminClaim.id);
          }
        }
        
        newSelectedClaims.add(claimId);
        setHasFullControl(false);
      } else {
        newSelectedClaims.delete(claimId);
      }
    }
    
    setSelectedClaims(newSelectedClaims);
  };

  // Check if claim is disabled
  const isClaimDisabled = (claim: UserClaim, group: string) => {
    if (claim.isRequired) return true;
    if (hasFullControl && group !== 'FullControl') return true;
    
    // Check if Admin claim is selected in this group
    const groupData = claimsGroups.find(g => g.group === group);
    const adminClaim = groupData?.claims.find(c => c.name.includes('.Admin'));
    if (adminClaim && selectedClaims.has(adminClaim.id) && claim.id !== adminClaim.id) {
      return true;
    }
    
    return false;
  };

  // Save user claims
  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateUserClaims({
        userId,
        claimIds: Array.from(selectedClaims),
      });
      
      toast({
        title: t('users.claimsUpdatedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (err) {
      console.error('Error updating user claims:', err);
      toast({
        title: t('errors.somethingWentWrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text fontSize="lg" fontWeight="bold">
            {t('users.permissionManagement')} - {userName}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="lg" />
            </Flex>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <VStack spacing={6} align="stretch">
              {claimsGroups.map((group) => (
                <Box key={group.group}>
                  <Box
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="gray.50"
                    _dark={{
                      borderColor: "blue.600",
                      bg: "navy.700"
                    }}
                  >
                    <Text fontSize="md" fontWeight="semibold" mb={3}>
                      {t(`claim.${group.group}.group`)}
                    </Text>
                    
                    <VStack spacing={3} align="stretch">
                      {group.claims.map((claim) => (
                        <HStack key={claim.id} justify="space-between">
                          <HStack spacing={3}>
                            <Checkbox
                              isChecked={selectedClaims.has(claim.id)}
                              onChange={(e) => handleClaimChange(claim.id, e.target.checked, group.group)}
                              isDisabled={isClaimDisabled(claim, group.group)}
                              colorScheme="blue"
                            />
                            <Text
                              fontSize="sm"
                              color={isClaimDisabled(claim, group.group) ? "gray.400" : "gray.700"}
                              _dark={{ color: isClaimDisabled(claim, group.group) ? "gray.500" : "gray.300" }}
                            >
                              {t(`claim.${claim.name}`)}
                            </Text>
                            {claim.isRequired && (
                              <Badge size="sm" colorScheme="green" variant="subtle">
                                {t('common.required')}
                              </Badge>
                            )}
                          </HStack>
                          
                          <Tooltip
                            label={t(`claim.${claim.name}.description`) || claim.description}
                            placement="left"
                          >
                            <IconButton
                              aria-label="Info"
                              icon={<InfoIcon />}
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                            />
                          </Tooltip>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={saving}
            isDisabled={loading || !!error}
          >
            {t('common.save')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserClaimsSidebar;
