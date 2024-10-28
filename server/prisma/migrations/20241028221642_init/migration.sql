BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Algorithm_Run] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [parameters] NVARCHAR(1000),
    [Is_active] BIT,
    [last_run_id] INT,
    CONSTRAINT [Algorithm_Run_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Allocations] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Hotel_ID] UNIQUEIDENTIFIER,
    [Settelment_ID] UNIQUEIDENTIFIER,
    [Rooms] UNIQUEIDENTIFIER,
    CONSTRAINT [Allocations_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[Rooms_SnapShot] (
    [Hotel_ID] UNIQUEIDENTIFIER NOT NULL,
    [room_type] NVARCHAR(100),
    [max_capacity] INT,
    [is_pet_friendly] BIT,
    [free_room_count] INT,
    [datetime] DATETIME2,
    CONSTRAINT [Rooms_SnapShot_pkey] PRIMARY KEY CLUSTERED ([Hotel_ID])
);

-- CreateTable
CREATE TABLE [dbo].[IDF_Settlement] (
    [Settlement_id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(100),
    [Settlement_sign] NVARCHAR(100),
    CONSTRAINT [IDF_Settlement_pkey] PRIMARY KEY CLUSTERED ([Settlement_id])
);

-- CreateTable
CREATE TABLE [dbo].[IDF_hotels] (
    [Hotel_ID] UNIQUEIDENTIFIER NOT NULL,
    [hotel_name] NVARCHAR(100),
    [City] NVARCHAR(100),
    [ADDRESS] NVARCHAR(100),
    CONSTRAINT [IDF_hotels_pkey] PRIMARY KEY CLUSTERED ([Hotel_ID])
);

-- CreateTable
CREATE TABLE [dbo].[IDF_Booking] (
    [Booking_id] UNIQUEIDENTIFIER NOT NULL,
    [Hotel_ID] UNIQUEIDENTIFIER NOT NULL,
    [Have_pets] INT NOT NULL,
    [room_type] INT NOT NULL,
    [Order_status] NVARCHAR(100),
    [Order_date] DATETIME NOT NULL,
    CONSTRAINT [IDF_Booking_pkey] PRIMARY KEY CLUSTERED ([Booking_id])
);

-- CreateTable
CREATE TABLE [dbo].[IDF_Rooms] (
    [Room_ID] INT NOT NULL IDENTITY(1,1),
    [Hotel_ID] UNIQUEIDENTIFIER NOT NULL,
    [Room_type] NVARCHAR(100),
    [free_room_count] INT NOT NULL,
    CONSTRAINT [IDF_Rooms_pkey] PRIMARY KEY CLUSTERED ([Room_ID])
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
