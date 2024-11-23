-- Drop the database 'DeGustoDB'
-- Connect to the 'master' database to run this snippet
USE master
GO

IF EXISTS (
  SELECT [name]
    FROM sys.databases
    WHERE [name] = N'DeGustoDB'
)
DROP DATABASE DeGustoDB
GO

CREATE DATABASE DeGustoDB
GO
use DeGustoDB
GO
CREATE TABLE PersonTypes (
  personTypeId INT PRIMARY KEY IDENTITY,
  personTypeName VARCHAR(100) NOT NULL,
  personTypeStatus BIT
);
CREATE TABLE Persons (
  personId INT PRIMARY KEY IDENTITY,
  personName VARCHAR(100) NOT NULL,
  personEmail VARCHAR(250) NOT NULL UNIQUE,
  personPhoneNumber VARCHAR(9) NOT NULL,
  person_Type INT NULL REFERENCES PersonTypes(personTypeId)
);
CREATE TABLE Users (
  userId INT PRIMARY KEY IDENTITY,
  userName VARCHAR(100) NOT NULL UNIQUE,
  userPassword VARCHAR(250) NOT NULL,
  userCreatedAt DATE NOT NULL,
  userStatus INT NOT NULL,
  user_personId INT NULL REFERENCES Persons(personId)
);
CREATE TABLE BusinessArea(
    businessAreaId INT PRIMARY KEY IDENTITY,
    businessAreaName VARCHAR(50) NOT NULL
);
CREATE TABLE Business (
  businessId INT PRIMARY KEY IDENTITY,
  businessName VARCHAR(100) NOT NULL,
  businessAddress VARCHAR(250) NOT NULL,
  businessPhoneNumber VARCHAR(9) NOT NULL,
  businessStatus INT NOT NULL DEFAULT 0,
  businessLogo VARCHAR(MAX),
  businessLatitude FLOAT,
  businessLongitude FLOAT,
  businessCategorization INT NOT NULL CHECK (businessCategorization >= 1 AND businessCategorization <= 5),
  business_AreaId INT NOT NULL REFERENCES BusinessArea(businessAreaId),
  business_UserId INT NULL REFERENCES Users(userId)
);
CREATE TABLE DishCategories (
  dishCategoryID INT PRIMARY KEY IDENTITY,
  dishCategoryName VARCHAR(100) NOT NULL,
  dishCategoryCreatedAt DATE,
  dishCategoryModifiedAt DATE,
  dishCategoryModifyByUser VARCHAR(100),
  dishCategory_BusinessId INT NULL REFERENCES Business(businessId),
);
CREATE TABLE Dishes (
  dishId INT PRIMARY KEY IDENTITY,
  dishName VARCHAR(100) NOT NULL,
  dishDescription VARCHAR(300),
  dishPrice DECIMAL(6, 2) NOT NULL,
  dishPhoto VARCHAR(MAX),
  dishStatus BIT NOT NULL,
  dish_BusinessId INT NOT NULL REFERENCES Business(businessId),
  dish_CategoriesId INT NOT NULL REFERENCES DishCategories(dishCategoryID)
);
CREATE TABLE Reservations (
  reservationId INT PRIMARY KEY IDENTITY,
  reservationTime DATETIME NOT NULL,
  reservationNumberPeople INT NOT NULL,
  reservationPaymentAmount DECIMAL(6,2) NOT NULL,
  reservationPaymentStatus INT NOT NULL,
  reservationPhoto VARCHAR(MAX) NOT NULL,
  reservation_UserId INT NULL REFERENCES Users(userId),
  reservation_BusinessId INT NOT NULL REFERENCES Business(businessId)
);
CREATE TABLE ReservationDetails (
  reservationDetailId INT NOT NULL IDENTITY,
  reservationDetailQuantity INT NOT NULL,
  reservationDetailPrice DECIMAL(6, 2) NOT NULL,
  detail_DishID INT NOT NULL REFERENCES Dishes(dishId),
  detail_ReservationId INT NOT NULL REFERENCES Reservations(reservationId)
);
CREATE TABLE reviews (
  reviewsId INT PRIMARY KEY IDENTITY,
  reviewRating INT CHECK (reviewRating >= 1 AND reviewRating <= 5),
  reviewComment VARCHAR(300) NOT NULL,
  reviewCreateAt DATETIME NOT NULL,
  review_UserId INT NOT NULL REFERENCES Users(userId),
  review_BusinessId INT NOT NULL REFERENCES Business(businessId)
);

