import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

interface HomeLocationState {
  scrollTo?: string;
}

const Index: FC = () => {
  const location = useLocation<HomeLocationState>();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  return <AppLayout />;
};

export default Index;
