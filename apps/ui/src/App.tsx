import React from "react";
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line

/*
 * This is the entry point component of this project. You can change the below exported default App component to any of
 * the prebuilt landing page components by uncommenting their import and export lines respectively.
 * See one of the landing page components to better understand how to import and render different components (Always
 * make sure if you are building your own page, the root component should be the AnimationRevealPage component. You can
 * disable the animation by using the disabled prop.
 *
 * The App component below is using React router to render the landing page that you see on the live demo website
 * and the component previews.
 *
 */

/* Use AnimationRevealPage as a wrapper component for your pages if you are building a custom one yourself */
// import AnimationRevealPage from "helpers/AnimationRevealPage";

/*
 * Hero section is the top most section on the page. It contains the header as well.
 * So you dont need to import headers
 * separately
 */

// import Hero from "components/hero/TwoColumnWithVideo";
// import Hero from "components/hero/TwoColumnWithInput";
// import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonial";
// import Hero from "components/hero/TwoColumnWithPrimaryBackground";
// import Hero from "components/hero/FullWidthWithImage";
// import Hero from "components/hero/BackgroundAsImage";
// import Hero from "components/hero/BackgroundAsImageWithCenteredContent";

// import Features from "components/features/ThreeColSimple";
// import Features from "components/features/ThreeColWithSideImage";
// import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground";
// import Features from "components/features/VerticalWithAlternateImageAndText";
// import Features from "components/features/DashedBorderSixFeatures";
// import MainFeature from "components/features/TwoColWithButton";
// import MainFeature from "components/features/TwoColSingleFeatureWithStats";
// import MainFeature2 from "components/features/TwoColSingleFeatureWithStats2";
// import MainFeature from "components/features/TwoColWithTwoHorizontalFeaturesAndButton";
// import FeatureWithSteps from "components/features/TwoColWithSteps";
// import FeatureStats from "components/features/ThreeColCenteredStatsPrimaryBackground";

// import Pricing from "components/pricing/ThreePlans";
// import Pricing from "components/pricing/ThreePlansWithHalfPrimaryBackground";
// import Pricing from "components/pricing/TwoPlansWithDurationSwitcher";

// import SliderCard from "components/cards/ThreeColSlider";
// import TrendingCard from "components/cards/TwoTrendingPreviewCardsWithImage";
// import Portfolio from "components/cards/PortfolioTwoCardsWithImage";
// import TabGrid from "components/cards/TabCardGrid";

// import Blog from "components/blogs/ThreeColSimpleWithImage";
// import Blog from "components/blogs/ThreeColSimpleWithImageAndDashedBorder";
// import Blog from "components/blogs/PopularAndRecentBlogPosts";
// import Blog from "components/blogs/GridWithFeaturedPost";

// import Testimonial from "components/testimonials/TwoColumnWithImage";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndRating";
// import Testimonial from "components/testimonials/ThreeColumnWithProfileImage";
// import Testimonial from "components/testimonials/SimplePrimaryBackground";

// import FAQ from "components/faqs/SimpleWithSideImage";
// import FAQ from "components/faqs/SingleCol";
// import FAQ from "components/faqs/TwoColumnPrimaryBackground";

// import ContactUsForm from "components/forms/SimpleContactUs";
// import ContactUsForm from "components/forms/TwoColContactUsWithIllustration";
// import SubscribeNewsLetterForm from "components/forms/SimpleSubscribeNewsletter";
//
// import GetStarted from "components/cta/GetStarted";
// import GetStarted from "components/cta/GetStartedLight";
// import DownloadApp from "components/cta/DownloadApp";

// import Footer from "components/footers/SimpleFiveColumn";
// import Footer from "components/footers/FiveColumnWithInputForm";
// import Footer from "components/footers/FiveColumnWithBackground";
// import Footer from "components/footers/FiveColumnDark";
// import Footer from "components/footers/MiniCenteredFooter";

/* Ready Made Pages (from demos folder) */
// import EventLandingPage from "demos/EventLandingPage";
// import HotelTravelLandingPage from "demos/HotelTravelLandingPage";
// import AgencyLandingPage from "demos/AgencyLandingPage";
// import SaaSProductLandingPage from "demos/SaaSProductLandingPage";
// import RestaurantLandingPage from "demos/RestaurantLandingPage";
// import ServiceLandingPage from "demos/ServiceLandingPage";
// import HostingCloudLandingPage from "demos/HostingCloudLandingPage";

/* Inner Pages */
// import LoginPage from "pages/Login";
// import SignupPage from "pages/Signup";
// import PricingPage from "pages/Pricing";
// import AboutUsPage from "pages/AboutUs";
// import ContactUsPage from "pages/ContactUs";
// import BlogIndexPage from "pages/BlogIndex";
// import TermsOfServicePage from "pages/TermsOfService";
// import PrivacyPolicyPage from "pages/PrivacyPolicy";

import ComponentRenderer from "./ComponentRenderer";
import MainLandingPage from "./MainLandingPage";
import ThankYouPage from "./ThankYouPage";
import SignIn from "pages/SignIn";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App(): JSX.Element {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/components/:type/:subtype/:name" element={<ComponentRenderer />} />
          <Route path="/components/:type/:name" element={<ComponentRenderer />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/" element={<MainLandingPage />} />
        </Routes>
      </Router>
    </>
  );
}

// export default EventLandingPage;
// export default HotelTravelLandingPage;
// export default AgencyLandingPage;
// export default SaaSProductLandingPage;
// export default RestaurantLandingPage;
// export default ServiceLandingPage;
// export default HostingCloudLandingPage;

// export default LoginPage;
// export default SignupPage;
// export default PricingPage;
// export default AboutUsPage;
// export default ContactUsPage;
// export default BlogIndexPage;
// export default TermsOfServicePage;
// export default PrivacyPolicyPage;

// export default MainLandingPage;
