USE DeGustoDB
GO

INSERT INTO PersonTypes (personTypeName, personTypeStatus)
VALUES
('Owner',1),
('Customer',1)


INSERT INTO Persons (personName, personEmail, personPhoneNumber, person_Type)
VALUES
('John Doe', 'johndoe@example.com', '123456789',1),
('Jane Smith', 'janesmith@example.com', '234567890',1),
('Robert Johnson', 'robertj@example.com', '345678901',1),
('Emily Davis', 'emilydavis@example.com', '456789012',1),
('Michael Brown', 'michaelb@example.com', '567890123',1),
('Alice Johnson', 'alicej@example.com', '678901234',2),
('David White', 'davidw@example.com', '789012345',2),
('Laura Green', 'laurag@example.com', '890123456',2),
('Charles Black', 'charlesb@example.com', '901234567',2),
('Sophia Blue', 'sophiablue@example.com', '012345678',2);

INSERT INTO Users (userName, userPassword, userCreatedAt, userStatus, user_PersonId)
VALUES
('john_doe', 'password123', '2024-09-01', 1, 1),
('jane_smith', 'securepass', '2024-09-02', 1, 2),
('robert_johnson', 'robertpass', '2024-09-04', 1, 3),
('alice_johnson', 'alicepass', '2024-09-01', 1, 6),
('david_white', 'whitedavid', '2024-09-03', 1, 7);

INSERT INTO BusinessArea (businessAreaName)
VALUES
('Restaurantes'),
('Hoteles'),
('Cines'),
('Tecnología'),
('Salud');
INSERT INTO Business (businessName, businessAddress, businessPhoneNumber, businessStatus, businessLogo, businessLatitude, businessLongitude, business_AreaId, business_UserId)
VALUES
('La Buena Mesa', '123 Gourmet Street', '123456789', 1, 'restaurant_logo.png', 40.712776, -74.005974, 1, 1),
('Hotel Paraíso', '456 Luxury Avenue', '234567890', 1, 'hotel_logo.png', 34.052235, -118.243683, 2, 2),
('Cinepolis', '789 Movie Blvd', '345678901', 1, 'cine_logo.png', 51.507351, -0.127758, 3, 3),
('Tech Solutions', '123 Tech Street', '123456789', 1, 'tech_logo.png', 40.712776, -74.005974, 4, 4),
('HealthPlus Clinic', '101 Health Street', '456789012', 1, 'health_logo.png', 41.878113, -87.629799, 5, 5);

INSERT INTO DishCategories (dishCategoryName, dishCategoryCreatedAt, dishCategoryModifiedAt, dishCategoryModifyByUser, dishCategory_BusinessId)
VALUES
('Entradas', '2024-09-01', NULL, 'admin', NULL),
('Platos Principales', '2024-09-01', NULL, 'admin', NULL),
('Acompañamientos', '2024-09-01', NULL, 'admin', NULL),
('Postres', '2024-09-01', NULL, 'admin', NULL),
('Bebidas', '2024-09-01', NULL, 'admin', NULL);
INSERT INTO Dishes (dishName, dishDescription, dishPrice, dishPhoto, dish_BusinessId, dish_CategoriesId)
VALUES
('Ensalada César', 'Ensalada con pollo, queso parmesano y aderezo César', 12.50, 'ensalada_cesar.png', 1, 1),
('Filete Mignon', 'Filete de res a la parrilla con salsa de champiñones', 25.00, 'filete_mignon.png', 1, 2),
('Papas Fritas', 'Papas fritas crujientes y doradas', 5.00, 'papas_fritas.png', 1, 3),
('Tiramisu', 'Postre italiano con café y queso mascarpone', 8.00, 'tiramisu.png', 1, 4),
('Cóctel de Mojito', 'Cóctel refrescante de ron con menta y lima', 7.00, 'mojito.png', 1, 5);

INSERT INTO Reservations (reservationTime, reservationNumberPeople, reservationPaymentAmount, reservationPaymentStatus, reservationPhoto, reservation_UserId, reservation_BusinessId)
VALUES
('2024-09-10 19:30:00', 4, 50.00, 1, 'reservation1.png', 1, 1),
('2024-09-11 20:00:00', 2, 30.00, 1, 'reservation2.png', 2, 1),
('2024-09-12 18:00:00', 6, 75.00, 1, 'reservation3.png', 3, 1),
('2024-09-13 21:00:00', 3, 40.00, 0, 'reservation4.png', 4, 1),
('2024-09-14 12:00:00', 5, 60.00, 1, 'reservation5.png', 5, 1);
-- Suponiendo que los IDs de las reservas y platos ya están definidos
-- IDs de platos asumidos: 1 (Ensalada César), 2 (Filete Mignon), etc.
INSERT INTO ReservationDetails (reservationDetailQuantity, reservationDetailPrice, detail_DishID, detail_ReservationId)
VALUES
(2, 25.00, 1, 1),  -- 2 Ensaladas César para la primera reserva
(1, 25.00, 2, 1),  -- 1 Filete Mignon para la primera reserva
(3, 15.00, 3, 2),  -- 3 Papas Fritas para la segunda reserva
(1, 8.00, 4, 2),   -- 1 Tiramisu para la segunda reserva
(1, 7.00, 5, 3);   -- 1 Cóctel de Mojito para la tercera reserva

-- Suponiendo que el CustomerId es 1 (John Doe) y el BusinessId del restaurante 'La Buena Mesa' es 1
INSERT INTO Reviews (reviewRating, reviewComment, review_UserId, review_BusinessId)
VALUES
(5, 'Excelente comida y servicio, volveré sin duda.', 1, 1),
(4, 'Muy buena experiencia, aunque el tiempo de espera fue largo.', 2, 1),
(3, 'La comida estuvo bien, pero el ambiente podría mejorar.', 3, 1),
(5, 'Un lugar maravilloso, comida deliciosa y excelente atención.', 4, 1),
(4, 'Buena comida, pero el precio es un poco elevado.', 5, 1);
