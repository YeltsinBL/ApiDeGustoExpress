-- Create a new database called 'DeGustoDB'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT [name]
        FROM sys.databases
        WHERE [name] = N'DeGustoDB'
)
CREATE DATABASE DeGustoDB
GO
use DeGustoDB
GO
CREATE TABLE Customers (
  customerId INT PRIMARY KEY IDENTITY,
  customerName VARCHAR(100) NOT NULL,
  customerEmail VARCHAR(250),
  customerPhoneNumber VARCHAR(9) NOT NULL
);
CREATE TABLE Owners (
  ownerId INT PRIMARY KEY IDENTITY,
  ownerName VARCHAR(100) NOT NULL,
  ownerEmail VARCHAR(250) NOT NULL UNIQUE,
  ownerPhoneNumber VARCHAR(9) NOT NULL
);
CREATE TABLE Users (
  userId INT PRIMARY KEY IDENTITY,
  userName VARCHAR(100) NOT NULL,
  userPassword VARCHAR(250) NOT NULL,
  userCreatedAt DATE NOT NULL,
  user_CustomerId INT NULL REFERENCES customers(customerId),
  user_OwnerId INT NULL REFERENCES OWNERS(ownerId)
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
  business_AreaId INT NOT NULL REFERENCES BusinessArea(businessAreaId),
  business_OwnerId INT NULL REFERENCES Owners(ownerId)
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
  reservation_CustomerId INT NOT NULL REFERENCES Customers(customerId),
  reservation_RestaurantId INT NOT NULL REFERENCES Business(businessId)
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
  reviewComment VARCHAR(300),
  review_CustomerId INT NOT NULL REFERENCES Customers(customerId),
  review_BusinessId INT NOT NULL REFERENCES Business(businessId)
);

