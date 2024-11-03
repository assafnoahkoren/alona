import { EnrichedHotel } from "../routers/models/hotelRoutes";
import { EnrichedSettlement } from "../routers/models/settlementRoutes";

export interface AlgorithmInput {
    hotels: EnrichedHotel[];
    settlements: EnrichedSettlement[];
    personsInRooms: number;
}

export interface AlgorithmOutput {
    allocations: Record<string, Record<string, number>>;
    unallocated: Record<string, number>;
    duration: number;
}

const algorithmService = {
    runAllocation: async (input: AlgorithmInput): Promise<AlgorithmOutput> => {
        // Implementation to be filled in later
        throw new Error("Not implemented");
    }
};

export default algorithmService;
