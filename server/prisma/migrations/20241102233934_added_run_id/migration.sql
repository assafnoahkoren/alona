BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Allocations] ADD [run_id] INT;

-- AlterTable
ALTER TABLE [dbo].[Rooms_SnapShot] ADD [run_id] INT;

-- AlterTable
ALTER TABLE [dbo].[Settlements_To_Evacuate] ADD [run_id] INT;

-- AddForeignKey
ALTER TABLE [dbo].[Allocations] ADD CONSTRAINT [Allocations_run_id_fkey] FOREIGN KEY ([run_id]) REFERENCES [dbo].[Algorithm_Run]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Rooms_SnapShot] ADD CONSTRAINT [Rooms_SnapShot_run_id_fkey] FOREIGN KEY ([run_id]) REFERENCES [dbo].[Algorithm_Run]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Settlements_To_Evacuate] ADD CONSTRAINT [Settlements_To_Evacuate_run_id_fkey] FOREIGN KEY ([run_id]) REFERENCES [dbo].[Algorithm_Run]([ID]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
