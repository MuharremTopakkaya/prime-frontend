import React, { ReactNode } from "react";
import tw from "twin.macro";

/* framer-motion and useInView here are used to animate the sections in when we reach them in the viewport
 */
import { motion } from "framer-motion";
import useInView from "helpers/useInView";

const StyledDiv = tw.div`font-display min-h-screen text-secondary-500 p-8 overflow-hidden`;

interface AnimationRevealProps {
  disabled?: boolean;
  children: ReactNode;
}

function AnimationReveal({ disabled, children }: AnimationRevealProps): JSX.Element {
  if (disabled) {
    return <>{children}</>;
  }

  let childrenArray = Array.isArray(children) ? children : [children];

  const directions = ["left", "right"] as const;
  const childrenWithAnimation = childrenArray.map((child, i) => {
    return (
      <AnimatedSlideInComponent key={i} direction={directions[i % directions.length]}>
        {child}
      </AnimatedSlideInComponent>
    );
  });
  return <>{childrenWithAnimation}</>;
}

interface AnimatedSlideInComponentProps {
  direction?: "left" | "right";
  offset?: number;
  children: ReactNode;
}

function AnimatedSlideInComponent({ direction = "left", offset = 30, children }: AnimatedSlideInComponentProps): JSX.Element {
  const [ref, inView] = useInView({ margin: `-${offset}px 0px 0px 0px`});

  const x = { target: "0%", initial: "" };

  if (direction === "left") x.initial = "-150%";
  else x.initial = "150%";

  return (
    <div ref={ref}>
      <motion.section
        initial={{ x: x.initial }}
        animate={{ 
          x: inView ? x.target : x.initial,
          transitionEnd:{
            x: inView ? 0 : undefined
          }
        }}
        transition={{ type: "spring", damping: 19 }}
      >
        {children}
      </motion.section>
    </div>
  );
}

export default (props: AnimationRevealProps): JSX.Element => (
  <StyledDiv className="App">
    <AnimationReveal {...props} />
  </StyledDiv>
);

