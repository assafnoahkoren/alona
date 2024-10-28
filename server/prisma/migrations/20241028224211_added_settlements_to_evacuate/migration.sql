BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Settlements_To_Evacuate] (
    [ID] UNIQUEIDENTIFIER NOT NULL,
    [Settlement_ID] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(100),
    [rooms_needed] NVARCHAR(100),
    CONSTRAINT [Settlements_To_Evacuate_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Settlements_To_Evacuate] ADD CONSTRAINT [Settlements_To_Evacuate_Settlement_ID_fkey] FOREIGN KEY ([Settlement_ID]) REFERENCES [dbo].[IDF_Settlement]([Settlement_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
