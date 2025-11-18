import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { notificationService, UserNotification, GetNotificationsResponse } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

function navigateFromNotification(notification: UserNotification, navigate: ReturnType<typeof useNavigate>) {
  try {
    if (!notification.dataJson) return;
    const data = JSON.parse(notification.dataJson);
    switch (data.TargetType) {
      case 'SupportRequest':
        navigate(`/support-requests/${data.TargetId}`);
        break;
      default:
        break;
    }
  } catch {}
}

const NotificationsPage: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState<GetNotificationsResponse | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const load = async (idx: number) => {
    const res = await notificationService.getNotifications(idx, 10);
    setData(res);
    // Eğer satırlarda detay butonu yoksa, görünür listedeki okunmayanları read yap
    const idsToMark = res.items.filter(n => !n.isRead && !n.dataJson).map(n => n.id);
    if (idsToMark.length) await notificationService.markAsRead(idsToMark);
  };

  useEffect(() => { load(pageIndex); }, [pageIndex]);

  const cardBgRead = useColorModeValue('gray.50', 'gray.700');
  const cardBgUnread = useColorModeValue('orange.50', 'orange.900');
  const cardText = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box mt={81}>
      <Heading size='md' mb={3} color={cardText}>{t('navigation.notifications')}</Heading>
      <Stack spacing={3} mt={{ base: 0, md: '90px' }} pt={0}>
        {data?.items.map(n => {
          const hasTarget = !!n.dataJson;
          return (
            <Flex key={n.id} p={3} borderWidth='1px' borderRadius='md' bg={n.isRead ? cardBgRead : cardBgUnread} align='center' justify='space-between'>
              <Box color={cardText}>
                <Text fontWeight='600'>{n.title || t('navigation.notifications')}</Text>
                <Text fontSize='sm'>{n.message}</Text>
                <Text fontSize='xs' color={useColorModeValue('gray.600','gray.300')}>{new Date(n.createdDate).toLocaleString()}</Text>
              </Box>
              <Flex gap={2}>
                {hasTarget && (
                  <Button size='sm' onClick={async () => {
                    await notificationService.markAsRead([n.id]);
                    navigateFromNotification(n, navigate);
                  }}>{t('common.details')}</Button>
                )}
                {!n.isRead && !hasTarget && (
                  <Button size='sm' variant='outline' onClick={async () => {
                    await notificationService.markAsRead([n.id]);
                    await load(pageIndex);
                  }}>{t('notifications.markAsRead')}</Button>
                )}
              </Flex>
            </Flex>
          );
        })}
      </Stack>
      <Flex mt={4} justify='space-between' align='center'>
        <Button onClick={() => setPageIndex(p => Math.max(0, p - 1))} isDisabled={!data?.pagination?.hasPrevious}>Önceki</Button>
        <Text>
          {`Sayfa ${data?.pagination ? data.pagination.index + 1 : 1} / ${data?.pagination?.pages ?? 1}`}
        </Text>
        <Button onClick={() => setPageIndex(p => p + 1)} isDisabled={!data?.pagination?.hasNext}>Sonraki</Button>
      </Flex>
    </Box>
  );
};

export default NotificationsPage;


