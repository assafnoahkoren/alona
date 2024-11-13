BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TBL_evacuation_data] (
    [Merhav] NVARCHAR(50) NOT NULL,
    [Eshkol] NVARCHAR(50) NOT NULL,
    [Rishut] NVARCHAR(50) NOT NULL,
    [Yishuv_Code] INT NOT NULL,
    [Yishuv_Number] INT NOT NULL,
    [Yishuv_Name] NVARCHAR(50) NOT NULL,
    [Religion] NVARCHAR(50) NOT NULL,
    [Population_Regular_21_7] INT NOT NULL,
    [Self_Evacuated] INT NOT NULL,
    [Population_Remaining_Estimate_16_7] INT NOT NULL,
    [Departure_Ratio_Regular] FLOAT(53) NOT NULL,
    [Independent_Evacuees_Current_Population] INT NOT NULL,
    [Evacuation_By_Buses] INT NOT NULL,
    [Will_Not_Evacuate] INT NOT NULL,
    [Age_0_2] INT NOT NULL,
    [Age_2_12] INT NOT NULL,
    [Age_0_12] INT NOT NULL,
    [Age_12_18] INT NOT NULL,
    [Age_0_2_Remaining] INT NOT NULL,
    [Age_2_12_Remaining] INT NOT NULL,
    [Age_0_12_Remaining] INT NOT NULL,
    [Age_12_18_Remaining] INT NOT NULL,
    [Bus_Count] INT NOT NULL,
    [Families_With_Children_Count] INT NOT NULL,
    [Families_With_Children_Evacuated_Count] INT NOT NULL,
    [Rooms_Required_For_Families_With_Children_Evacuated] INT NOT NULL,
    [Residents_Without_Family_Evacuated_Count] INT NOT NULL,
    [Rooms_For_Residents_Without_Minor_Children] INT NOT NULL,
    [Total_Rooms_Required_All_Evacuees] INT NOT NULL,
    [Total_Rooms_Required_For_Bus_Evacuees] INT NOT NULL,
    [Total_Rooms_Required_For_Independent_Evacuees_After_Order] INT NOT NULL,
    [Total_Rooms_Required_All_Evacuees_After_Order] INT NOT NULL,
    [Total_Estimated_Rooms_For_Residents_Outside_Yishuv_July_24] INT NOT NULL,
    [Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining] INT NOT NULL,
    CONSTRAINT [TBL_evacuation_data_pkey] PRIMARY KEY CLUSTERED ([Yishuv_Number])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
