// Chakra Imports
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

export default function AdminNavbar(props) {
	const { t } = useTranslation();
	const location = useLocation();
	const [ scrolled, setScrolled ] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, message, brandText } = props;

	// Dynamic breadcrumb and page title based on current route
	const getPageInfo = () => {
		const path = location.pathname;
		
        if (path.includes('/companies')) {
          return {
            breadcrumb: t('navigation.companies'),
            title: t('navigation.companies')
          };
        } else if (path.includes('/companies/') && path.split('/').length > 3) {
          return {
            breadcrumb: `${t('navigation.companies')} / ${t('common.details')}`,
            title: t('common.details')
          };
        } else if (path.includes('/partners')) {
			return {
				breadcrumb: t('navigation.partners'),
				title: t('navigation.partners')
			};
		} else if (path.includes('/default')) {
			return {
				breadcrumb: t('navigation.dashboard'),
				title: t('navigation.dashboard')
			};
		} else if (path.includes('/nft-marketplace')) {
			return {
				breadcrumb: t('navigation.nftMarketplace'),
				title: t('navigation.nftMarketplace')
			};
		} else if (path.includes('/data-tables')) {
			return {
				breadcrumb: t('navigation.dataTables'),
				title: t('navigation.dataTables')
			};
		} else if (path.includes('/profile')) {
			return {
				breadcrumb: t('navigation.profile'),
				title: t('navigation.profile')
			};
		}
		
		// Default fallback
		return {
			breadcrumb: brandText || t('navigation.dashboard'),
			title: brandText || t('navigation.dashboard')
		};
	};

	const pageInfo = getPageInfo();

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	return (
		<Box
			position={navbarPosition as any}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius={{ base: '12px', md: '16px' }}
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH={{ base: '60px', md: '75px' }}
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt={secondaryMargin}
			pb={{ base: '6px', md: '8px' }}
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: paddingX,
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt={{ base: '6px', md: '8px' }}
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}>
			<Flex
				w='100%'
				flexDirection={{
					sm: 'column',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize={{ base: 'xs', md: 'sm' }} mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								{t('common.pages')}
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize={{ base: 'xs', md: 'sm' }} mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								{pageInfo.breadcrumb}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Brand text hidden to avoid duplication */}
				</Box>
				<Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						logoText={props.logoText}
						secondary={props.secondary}
						fixed={props.fixed}
						scrolled={scrolled}
					/>
				</Box>
			</Flex>
			{secondary ? <Text color='white'>{message}</Text> : null}
		</Box>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func,
	logoText: PropTypes.string,
	message: PropTypes.any
};
