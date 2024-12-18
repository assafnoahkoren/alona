import algorithmRunService from './algorithmRunService';
import allocationService from './allocationService';
import settlementToEvacuateService from './settlementToEvacuateService';
import hotelService from './hotelService';
import roomService from './roomService';
import settlementService from './settlementService';
import evacuationDataService from './evacuationDataService.ts';
import authService from './authService.ts';
import userService from './userService.ts';

const apiService = {
  algorithmRun: algorithmRunService,
  allocation: allocationService,
  settlementToEvacuate: settlementToEvacuateService,
  hotels: hotelService,
  rooms: roomService,
  settlements: settlementService,
  evacuationData: evacuationDataService,
  auth: authService,
  user: userService,
};

export default apiService;
