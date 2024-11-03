import { useEffect } from 'react';
import { staticDataStore } from '../stores/static-data-store';

const NewPlan = () => {
  useEffect(() => {
    staticDataStore.fetchData().then(() => {
      console.log(staticDataStore.settlemenentToEvacuate);
      console.log(staticDataStore.hotelsWithRooms);
    });
  }, []);
  return <div>NewPlan</div>;
};

export default NewPlan;
