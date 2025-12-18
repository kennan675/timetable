import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

interface HomeLocationState {
  scrollTo?: string;
}

const Index: FC = () => {
  const location = useLocation();
  const state = location.state as HomeLocationState;

  useEffect(() => {
    const targetId = state?.scrollTo;
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [state]);

  return <AppLayout />;
};

export default Index;
