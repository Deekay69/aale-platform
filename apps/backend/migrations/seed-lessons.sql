-- Sample Lessons for AALE Platform
-- Run this in Railway Dashboard > PostgreSQL > Data tab > Query

INSERT INTO lessons (title, subject, difficulty, content_type, content_data, version, prerequisites) VALUES
('Adding Single Digits', 'Math', 1, 'visual', '{"question":"What is 3 + 4?","options":["5","6","7","8"],"correct":2,"explanation":"When you add 3 and 4, you get 7!"}', 1, '[]'),
('Counting Objects', 'Math', 1, 'visual', '{"question":"How many apples are there? 🍎🍎🍎🍎🍎","options":["3","4","5","6"],"correct":2,"explanation":"Count them carefully: 1, 2, 3, 4, 5!"}', 1, '[]'),
('Subtraction Basics', 'Math', 1, 'text', '{"question":"If you have 8 candies and eat 3, how many are left?","options":["4","5","6","7"],"correct":1,"explanation":"8 - 3 = 5 candies remaining"}', 1, '[]'),
('Animal Sounds', 'Science', 1, 'visual', '{"question":"What sound does a cow make?","options":["Meow","Woof","Moo","Quack"],"correct":2,"explanation":"Cows say Moo! 🐄"}', 1, '[]'),
('Shapes Recognition', 'Math', 2, 'visual', '{"question":"How many sides does a triangle have?","options":["2","3","4","5"],"correct":1,"explanation":"A triangle has 3 sides!"}', 1, '[]'),
('Days of the Week', 'General Knowledge', 2, 'text', '{"question":"What day comes after Wednesday?","options":["Tuesday","Thursday","Friday","Saturday"],"correct":1,"explanation":"Thursday comes after Wednesday"}', 1, '[]'),
('Simple Multiplication', 'Math', 2, 'mixed', '{"question":"What is 2 × 3?","options":["4","5","6","7"],"correct":2,"explanation":"2 groups of 3 make 6"}', 1, '[]'),
('Colors in Swahili', 'Language', 2, 'visual', '{"question":"What is red in Swahili?","options":["Nyekundu","Bluu","Kijani","Njano"],"correct":0,"explanation":"Nyekundu means red in Swahili! 🔴"}', 1, '[]'),
('Fraction Basics', 'Math', 3, 'visual', '{"question":"What is 1/2 of 10?","options":["3","4","5","6"],"correct":2,"explanation":"Half of 10 is 5"}', 1, '[]'),
('Plants Need', 'Science', 3, 'text', '{"question":"What do plants need to grow?","options":["Only water","Only sunlight","Water, sunlight, and air","Only soil"],"correct":2,"explanation":"Plants need water, sunlight, and air to grow healthy and strong! 🌱"}', 1, '[]');

-- Verify the insert
SELECT COUNT(*) as total_lessons FROM lessons;
