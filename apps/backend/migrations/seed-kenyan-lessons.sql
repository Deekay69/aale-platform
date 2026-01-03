-- Kenyan Curriculum-Aligned Lessons for AALE Platform
-- Run this in Railway Dashboard > PostgreSQL > Data/Query tab

-- These lessons use real Kenyan context (shillings, matatus, local foods, etc.)

INSERT INTO lessons (title, subject, difficulty, content_type, content_data) VALUES

-- GRADE 3 MATH
('Kenyan Currency - Counting Shillings', 'Math', 3, 'visual', 
 '{"question":"Mama Jane bought sukuma wiki for 20 shillings and tomatoes for 30 shillings. How much did she spend?","options":["40 shillings","50 shillings","60 shillings","70 shillings"],"correct":1,"explanation":"20 + 30 = 50 shillings. Great job counting money!"}'),

('Multiplication - Matatu Seats', 'Math', 3, 'mixed', 
 '{"question":"A matatu has 4 rows of seats. Each row has 3 seats. How many seats in total?","options":["7 seats","10 seats","12 seats","15 seats"],"correct":2,"explanation":"4 rows × 3 seats = 12 seats. This is multiplication!"}'),

('Time - School Schedule', 'Math', 3, 'visual', 
 '{"question":"School starts at 8:00 AM and ends at 3:00 PM. How many hours is the school day?","options":["5 hours","6 hours","7 hours","8 hours"],"correct":2,"explanation":"From 8 AM to 3 PM is 7 hours. Count carefully!"}'),

-- GRADE 3 SCIENCE
('Kenyan Wildlife - Animal Habitats', 'Science', 3, 'visual', 
 '{"question":"Where do fish like tilapia live?","options":["In trees","In water","Underground","In the sky"],"correct":1,"explanation":"Tilapia and other fish live in water - rivers, lakes, and oceans! 🐟"}'),

('Plants We Eat - Kenyan Foods', 'Science', 3, 'mixed', 
 '{"question":"Which part of the maize plant do we eat?","options":["The roots","The leaves","The seeds (grains)","The stem"],"correct":2,"explanation":"We eat the maize seeds/grains! They are ground into flour for ugali. 🌽"}'),

('Weather in Kenya', 'Science', 3, 'text', 
 '{"question":"What happens to puddles when the sun is very hot?","options":["They freeze","They evaporate (dry up)","They get bigger","They turn green"],"correct":1,"explanation":"The sun heat makes water evaporate - it turns into water vapor in the air!"}'),

-- GRADE 3 ENGLISH  
('Swahili-English Words', 'English', 3, 'text', 
 '{"question":"What is the plural of ''book''?","options":["book","books","bookes","book''s"],"correct":1,"explanation":"We add ''s'' to make most words plural. One book, two books!"}'),

('Punctuation - Kenyan Names', 'English', 3, 'text', 
 '{"question":"Which sentence is written correctly?","options":["my friend wanjiru is from nairobi","My friend Wanjiru is from Nairobi.","my Friend wanjiru is From nairobi","My Friend Wanjiru Is From Nairobi"],"correct":1,"explanation":"Names of people and places start with capital letters. Sentences end with a period!"}'),

-- SOCIAL STUDIES
('Kenyan Counties', 'Social Studies', 3, 'visual', 
 '{"question":"Which county is the capital city Nairobi in?","options":["Mombasa County","Nairobi County","Kisumu County","Nakuru County"],"correct":1,"explanation":"Nairobi is both a city AND a county! It is Kenya capital. 🇰🇪"}'),

('Community Helpers', 'Social Studies', 3, 'mixed', 
 '{"question":"Who helps us when we are sick?","options":["Teacher","Doctor or Nurse","Engineer","Artist"],"correct":1,"explanation":"Doctors and nurses help us stay healthy and treat us when we are sick!"}');

-- Verify the data
SELECT id, title, subject, difficulty FROM lessons ORDER BY subject, difficulty;
