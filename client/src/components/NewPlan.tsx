import { useEffect } from 'react';
import { staticDataStore } from '../stores/static-data-store';

const NewPlan = () => {
  useEffect(() => {
    staticDataStore.fetchData();
  }, []);
  return <div>NewPlan</div>;
};

export default NewPlan;
