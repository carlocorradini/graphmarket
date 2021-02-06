-- INSERT INTO public.review(
--    id, title, body, rating, created_at, updated_at, author_id, product_id)
--    VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- All purchases performed the day
-- 2021-02-15 08:30:00.123456

-- mario95's review of his purchases. His ID: 6ae7027a-4d08-49f9-890c-d0ee39168295

-- Chessboard: 5d1d610c-7d75-4c39-81d8-4c812c8b09d8
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('23701d38-8411-4857-b809-da64cad704cc',
        'Beautiful and comfortable, with a great value for money',
        'I decided to buy the chessboard to start playing with my children, focusing on a basic product that didn''t cost too much. I must say that the value for money is excellent. The chessboard, although made of plastic, is beautiful and elegant to look at.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', '5d1d610c-7d75-4c39-81d8-4c812c8b09d8');

-- Gameboy: 664a9e20-8546-465f-b60c-b503672a1394
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('ab62ed53-7135-4562-8aee-3ab3159eb787',
        'This made me fail my calculus classes',
        'This product conforms to the description. Indeed, it is addictive, and distracted me from my student duties. In the end, it made me fail my calculus exam.',
        3,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', '664a9e20-8546-465f-b60c-b503672a1394');

-- Lego: 255cdd05-9d48-43da-8515-845a58347fbf
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('43d011dc-5a7d-4274-99ee-7473f6f17665',
        'Lego is awesome',
        'Who does not love lego games? A guarantee for years now. I bought this set to give to my cousin at Christmas. One of the most beautiful police barracks ever. The only flaw is that the box arrived a little dented.',
        4,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', '255cdd05-9d48-43da-8515-845a58347fbf');

-- Flute: 478453da-b32f-4fe4-bd11-d8b73710349d
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('c8d136d5-b5bf-49c9-804e-42e726c7253f',
        'Great for flute study at school.',
        'The flute comes with a cleaning rod and a very mediocre plastic case. The sound, however, is light and gentle, really very pleasant. Great for teaching for kids, I got it for my kid going to elementary school.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', '478453da-b32f-4fe4-bd11-d8b73710349d');

-- Violin: ad886aa6-2f08-4671-9d43-b48ef93592e3
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('b75212a7-4284-4982-8e7e-421e71563acf',
        'Good for beginners.',
        'If you are considering buying it for your children, it is a nice idea, but I recommend buying ear plugs. On the other hand, it is excellent for the children of people you least tolerate.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', 'ad886aa6-2f08-4671-9d43-b48ef93592e3');

-- Nokia: 52bcadc3-4079-4815-a86f-861d8ae0e101
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('b4280961-69ed-4d23-9d4d-d357f38d047e',
        'It let me down',
        'The phone that made history for longevity and endurance, unfortunately, is no longer the same. It turns off all the time, the battery does not hold a charge despite being recharged for hours, the backlight of the screen is practically a flicker.',
        2,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', '52bcadc3-4079-4815-a86f-861d8ae0e101');

-- Phone charger: fb97413a-2b6f-40e8-8dbe-cfee5bb8518c
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('ff9d4f21-624b-4603-8c29-dbc7f962431f',
        'Does what it promises.',
        'Super compact battery charger that recharges quickly. Very convenient to carry around in your suitcase. Allows you to recharge two devices at the same time.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', 'fb97413a-2b6f-40e8-8dbe-cfee5bb8518c');

-- The Lord of the Rings: c0c39e9b-5a24-4fad-9bfb-e3d2bb200eea
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('32ae1b68-5fb6-4b79-824b-db2a252e2a37',
        'Satisfied',
        'I bought these books because, alas, they were missing from my library. So I decided to redeem myself and buy a copy that would do justice to the magnificent masterpiece it is. They arrived in perfect condition, without any creases.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', 'c0c39e9b-5a24-4fad-9bfb-e3d2bb200eea');

-- Bread: a6320f40-b80c-476e-b2e2-ac3fdbd3dad5
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('f0b9ba05-9336-455f-9643-9cb225b03a4e',
        'It did not impress me.',
        'I generally use it for breakfast or snack after roasting, but these slices, albeit with a good taste, arrive very dry (they break when you take them out of the package) and once toasted they literally crumble.',
        3,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '6ae7027a-4d08-49f9-890c-d0ee39168295', 'a6320f40-b80c-476e-b2e2-ac3fdbd3dad5');

-- federico96's review of his purchases. His ID: 76208348-7ddf-4fed-821b-46dcb8c75ccd

-- Chessboard: 5d1d610c-7d75-4c39-81d8-4c812c8b09d8
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('b25e9979-1b0e-4aa0-8751-09e2d209eb7c',
        'Good folding chessboard, with minimal defects',
        'The white squares are actually light gray, but that''s not particularly annoying. On the other hand, the checkers'' pieces are not magnetic, as described. All in all, these are minimal defects, which can be overlooked.',
        4,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', '5d1d610c-7d75-4c39-81d8-4c812c8b09d8');

-- Gameboy: 664a9e20-8546-465f-b60c-b503672a1394
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('5c5956a4-651c-47db-b870-77c6a7cd794b',
        'Nice Gameboy',
        'I have no complaints. I can play Pokemon games again!',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', '664a9e20-8546-465f-b60c-b503672a1394');

-- Lego: 255cdd05-9d48-43da-8515-845a58347fbf
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('a37c9c04-fdd4-402c-ac72-6f21ff64ced3',
        'Lego is life',
        'There is little to say, with LEGO you are never wrong. The package comes with detailed assembly instructions and spare parts. For young and old it is a lot of fun to build.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', '255cdd05-9d48-43da-8515-845a58347fbf');

-- Flute: 478453da-b32f-4fe4-bd11-d8b73710349d
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('80603899-5017-4e5a-9c13-da47de509dbe',
        'Cute, but... a toy',
        'The sounds of the instrument do not correspond to those classified. For single practice it can be fine, but you can''t play along with a keyboard or other instruments because the pitch doesn''t match.',
        2,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', '478453da-b32f-4fe4-bd11-d8b73710349d');

-- Violin: ad886aa6-2f08-4671-9d43-b48ef93592e3
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('4cc302a7-e661-4c19-9601-a99a17e70d63',
        'Great to start.',
        'The violin arrived intact and with all the items in the set. It has passed the examination of the music teacher. It keeps the tuning and, to start out, is perfect.',
        4,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', 'ad886aa6-2f08-4671-9d43-b48ef93592e3');

-- Nokia: 52bcadc3-4079-4815-a86f-861d8ae0e101
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('afeb84b7-30b5-4c23-bef7-eaac7456b331',
        'Not the best, but it works',
        'The mobile works and reads the SIM correctly. Too bad that the cover does not snap well: I have to squeeze it to insert it. For the rest everything is fine.',
        4,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', '52bcadc3-4079-4815-a86f-861d8ae0e101');

-- Phone charger: fb97413a-2b6f-40e8-8dbe-cfee5bb8518c
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('a01c3c16-9436-4d4b-b9a4-28cc379707c4',
        'Perfect',
        'No complaints: it is as described and works well',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', 'fb97413a-2b6f-40e8-8dbe-cfee5bb8518c');

-- The Lord of the Rings: c0c39e9b-5a24-4fad-9bfb-e3d2bb200eea
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('50369249-23f5-4253-959f-4c58b6f13a02',
        'One of the most beautiful boxes of Tolkien''s works',
        'Although I wasn''t expecting something exceptional, I had to change my mind as the external box, made of cardboard and covered in similar leather, has a very pleasant effect.',
        5,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', 'c0c39e9b-5a24-4fad-9bfb-e3d2bb200eea');

-- Bread: a6320f40-b80c-476e-b2e2-ac3fdbd3dad5
INSERT INTO public.review(id,
                          title,
                          body,
                          rating,
                          created_at, updated_at,
                          author_id, product_id)
VALUES ('7ac7c30d-5dc7-4ddd-a75d-c6fb8b1e84df',
        'Okayish bread.',
        'This bread is quite dry, so I recommend using it maybe for sandwiches with tomato or something that wet the slice a little, so you don''t get suffocated.',
        4,
        '2021-02-15 08:30:00.123456', '2021-02-15 08:30:00.123456',
        '76208348-7ddf-4fed-821b-46dcb8c75ccd', 'a6320f40-b80c-476e-b2e2-ac3fdbd3dad5');
