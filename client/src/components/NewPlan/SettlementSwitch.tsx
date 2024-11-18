import { Switch } from "@mantine/core";
import { Box } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { evacPlanStore } from "../../stores/evac-plan-store.ts";
import { EvacuationDataResponse } from "../../../../server/routers/models/evacuationDataRoutes.ts";

const SettlementSwitch = ({ settlement }: { settlement: EvacuationDataResponse }) => {
  return (
      <Switch

        classNames={{
          track: 'cursor-pointer',
          label: 'cursor-pointer',
          thumb: 'cursor-pointer',
        }}
        label={settlement.yishuvName}
        checked={evacPlanStore.getSettlementData(settlement.yishuvNumber)?.markedForEvac}
        onChange={(event) => evacPlanStore.set_markedForEvac(settlement.yishuvNumber, event.currentTarget.checked)}
      />
  );
};

export default observer(SettlementSwitch);
