-- INSERT INTO public."user"(
--	id, username, password, roles, name, surname, gender, date_of_birth, email, phone, avatar, created_at, updated_at, verified)
--	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Carlo and Andrea
-- Two sellers with a valid phone number
insert into public."user" (id,
                           username,
                           password,
                           roles, name, surname, gender, date_of_birth,
                           email, phone,
                           avatar,
                           created_at, updated_at, verified)
values ('1c0087cb-78bf-4644-a12e-be1462e02dc4',
        'carlo98',
        '$2a$12$0hnojTPkMR6BwhPy6SjlwegLZPnG2z4mpUcgwdN3ZXfvahEGb7sXm',
        '{USER,SELLER}', 'Carlo', 'Corradini', 'MALE', '1998-12-24',
        'carlo98@graphmarket.com', '+393273679553',
        'https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456', 'True');
insert into public."user" (id,
                           username,
                           password,
                           roles, name, surname, gender, date_of_birth,
                           email, phone,
                           avatar,
                           created_at, updated_at, verified)
values ('3a8a8563-97c2-460e-93c7-9d562fa33943',
        'andrea97',
        '$2a$12$0hnojTPkMR6BwhPy6SjlwegLZPnG2z4mpUcgwdN3ZXfvahEGb7sXm',
        '{USER,SELLER}', 'Andrea', 'Stedile', 'MALE', '1997-03-08',
        'andrea97@graphmarket.com', '+3402936047',
        'https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456', 'True');

-- Graphmarket users
insert into public."user" (id,
                           username,
                           password,
                           roles, name, surname, gender, date_of_birth,
                           email, phone,
                           avatar,
                           created_at, updated_at, verified)
values ('6ae7027a-4d08-49f9-890c-d0ee39168295',
        'mario95',
        '$2a$12$0hnojTPkMR6BwhPy6SjlwegLZPnG2z4mpUcgwdN3ZXfvahEGb7sXm',
        '{USER}', 'Mario', 'Rossi', 'MALE', '1995-01-05',
        'mario95@gmail.com', '+39320555145',
        'https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456', 'True');
insert into public."user" (id,
                           username,
                           password,
                           roles, name, surname, gender, date_of_birth,
                           email, phone,
                           avatar,
                           created_at, updated_at, verified)
values ('76208348-7ddf-4fed-821b-46dcb8c75ccd',
        'federico96',
        '$2a$12$0hnojTPkMR6BwhPy6SjlwegLZPnG2z4mpUcgwdN3ZXfvahEGb7sXm',
        '{USER}', 'Federico', 'Rossi', 'MALE', '1996-02-10',
        'federico96@gmail.com', '+39311015552',
        'https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png',
        '2021-01-30 22:30:45.123456', '2021-01-30 22:30:45.123456', 'True');
