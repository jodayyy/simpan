import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PAGE_ORDER = [
  '/dashboard',
  '/commitments',
  '/savings',
  '/profile',
  '/profile/change-password',
];

function getPageIndex(pathname: string): number {
  const index = PAGE_ORDER.indexOf(pathname);
  return index === -1 ? 0 : index;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  useEffect(() => {
    const prevIndex = getPageIndex(prevPathRef.current);
    const currIndex = getPageIndex(location.pathname);
    directionRef.current = currIndex >= prevIndex ? 1 : -1;
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const direction = directionRef.current;

  const variants = {
    initial: {
      opacity: 0,
      x: isMobile ? 20 * direction : 0,
      y: isMobile ? 0 : 20 * direction,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: isMobile ? -20 * direction : 0,
      y: isMobile ? 0 : -20 * direction,
    },
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
