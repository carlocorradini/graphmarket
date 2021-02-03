--INSERT INTO public.inventory(
--	id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
--	VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- carlo98's id:
-- 1c0087cb-78bf-4644-a12e-be1462e02dc4

-- andrea97's id:
-- 3a8a8563-97c2-460e-93c7-9d562fa33943


-- TOYS_AND_GAMES

-- Chessboard and chess set
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('079a5ea2-0e47-4df1-b81a-6af602a5d52b', '2299', 10, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '5d1d610c-7d75-4c39-81d8-4c812c8b09d8', '1c0087cb-78bf-4644-a12e-be1462e02dc4');

-- Gameboy
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('0d2a7898-04ac-4f1f-95e7-34800c88eaa0', '3000', 5, 'RENEWED',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '664a9e20-8546-465f-b60c-b503672a1394', '3a8a8563-97c2-460e-93c7-9d562fa33943');

-- Gameboy 2nd hand
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('f75258d7-c6f0-442b-85ee-a54ab0af24d2', '1500', 5, 'USED_ACCEPTABLE',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '664a9e20-8546-465f-b60c-b503672a1394', '1c0087cb-78bf-4644-a12e-be1462e02dc4');

-- Lego
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('c375c08f-7dae-4f79-a748-b5f5adb4e6f7', '5639', 8, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '255cdd05-9d48-43da-8515-845a58347fbf', '3a8a8563-97c2-460e-93c7-9d562fa33943');


-- MUSICAL_INSTRUMENTS

-- Flute
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('5278abe1-e911-4c2a-b004-60055021fd8f', '690', 14, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '478453da-b32f-4fe4-bd11-d8b73710349d', '3a8a8563-97c2-460e-93c7-9d562fa33943');

-- Flute 2nd hand
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('5f0eaf3c-e31f-4cfb-9460-bd4dadc6a7ba', '375', 3, 'USED_VERY_GOOD',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '478453da-b32f-4fe4-bd11-d8b73710349d', '3a8a8563-97c2-460e-93c7-9d562fa33943');

-- Violin
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('c0068399-c0bf-4006-a8d0-96e931af9544', '5399', 7, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        'ad886aa6-2f08-4671-9d43-b48ef93592e3', '1c0087cb-78bf-4644-a12e-be1462e02dc4');

-- CELL_PHONES_AND_ACCESSORIES

-- Nokia
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('046a2fe3-7b6b-417f-9e32-e6bf5653b85c', '2990', 2, 'RENEWED',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '52bcadc3-4079-4815-a86f-861d8ae0e101', '1c0087cb-78bf-4644-a12e-be1462e02dc4');

-- Nokia 2nd hand
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('6aba02a2-8771-4db6-83e7-d46730488eb0', '1645', 2, 'RENEWED',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        '52bcadc3-4079-4815-a86f-861d8ae0e101', '3a8a8563-97c2-460e-93c7-9d562fa33943');

-- Phone charger
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('d98bf6ca-5569-42b6-9656-96420d581390', '1099', 16, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        'fb97413a-2b6f-40e8-8dbe-cfee5bb8518c', '3a8a8563-97c2-460e-93c7-9d562fa33943');

-- BOOKS

-- The Lord of the Rings
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('89be4799-e22f-457d-80f1-3789719d5987', '2895', 16, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        'c0c39e9b-5a24-4fad-9bfb-e3d2bb200eea', '1c0087cb-78bf-4644-a12e-be1462e02dc4');

-- GROCERY_AND_GOURMET_FOOD

-- Bread
INSERT INTO public.inventory(id, price, quantity, condition, created_at, updated_at, product_id, seller_id)
VALUES ('1037416d-df41-4838-a563-6ed6f07a590c', '99', 12, 'NEW',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456',
        'a6320f40-b80c-476e-b2e2-ac3fdbd3dad5', '3a8a8563-97c2-460e-93c7-9d562fa33943');
