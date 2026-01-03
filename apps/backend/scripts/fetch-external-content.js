/**
 * Educational Content API Integrations
 * Fetches curated content from external educational APIs
 */

const axios = require('axios');
const pool = require('../config/database');

/**
 * Oak National Academy API Integration
 * Free, high-quality UK curriculum content
 * https://www.thenational.academy/oak-api
 */
class OakNationalAPI {
    constructor() {
        this.baseURL = 'https://api.thenationalacademy.com/v1';
    }

    async fetchLessons(subject, keyStage = 'ks2') {
        try {
            const response = await axios.get(`${this.baseURL}/lessons`, {
                params: { subject, key_stage: keyStage }
            });
            return response.data;
        } catch (error) {
            console.error('Oak API error:', error.message);
            return [];
        }
    }

    /**
     * Adapt Oak content to AALE format
     */
    adaptToAALE(oakLesson, gradeLevel = 3) {
        return {
            title: oakLesson.title,
            subject: this.mapSubject(oakLesson.subject),
            difficulty: gradeLevel,
            content_type: 'mixed',
            content_data: {
                question: oakLesson.quiz_questions?.[0]?.question || '',
                options: oakLesson.quiz_questions?.[0]?.answers || [],
                correct: 0, // Would need to parse from Oak data
                explanation: oakLesson.quiz_questions?.[0]?.hint || 'Great work!',
                source: 'Oak National Academy',
                original_url: oakLesson.permalink
            }
        };
    }

    mapSubject(oakSubject) {
        const mapping = {
            'maths': 'Math',
            'english': 'English',
            'science': 'Science',
            'geography': 'Social Studies',
            'history': 'Social Studies'
        };
        return mapping[oakSubject.toLowerCase()] || oakSubject;
    }
}

/**
 * Khan Academy API (if available)
 * Note: Khan Academy doesn't have a public API for content
 * But they have exercise data available via GraphQL
 */
class KhanAcademyAPI {
    constructor() {
        this.baseURL = 'https://www.khanacademy.org/api/v1';
    }

    // This would require authentication and proper API access
    async fetchExercises(topic) {
        console.log('⚠️  Khan Academy requires OAuth. Using alternative sources.');
        return [];
    }
}

/**
 * AfricaCode / African Storybook Integration
 * Free, open-source African educational content
 */
class AfricanStorybookAPI {
    constructor() {
        this.baseURL = 'https://www.africanstorybook.org/api';
    }

    async fetchStories(language = 'en') {
        try {
            // African Storybook provides RSS feeds and JSON endpoints
            const response = await axios.get(`${this.baseURL}/stories`, {
                params: { lang: language, level: '2-3' }
            });
            return response.data;
        } catch (error) {
            console.error('African Storybook API error:', error.message);
            return [];
        }
    }

    adaptToAALE(story) {
        return {
            title: `Reading: ${story.title}`,
            subject: 'English',
            difficulty: 3,
            content_type: 'text',
            content_data: {
                question: `What is the main idea of "${story.title}"?`,
                options: [
                    'Option A (would need to generate from story)',
                    'Option B',
                    'Option C',
                    'Option D'
                ],
                correct: 0,
                explanation: 'Reading comprehension builds language skills!',
                story_text: story.content,
                source: 'African Storybook Initiative'
            }
        };
    }
}

/**
 * Hybrid Content Fetcher
 * Combines multiple sources
 */
async function fetchHybridContent(count = 10) {
    console.log('🌍 Fetching content from multiple sources...\n');

    const lessons = [];

    // Try Oak National Academy
    try {
        const oak = new OakNationalAPI();
        console.log('📚 Attempting Oak National Academy...');
        const oakLessons = await oak.fetchLessons('maths');
        if (oakLessons.length > 0) {
            lessons.push(...oakLessons.slice(0, Math.floor(count / 2)).map(l => oak.adaptToAALE(l)));
            console.log(`✓ Fetched ${Math.min(oakLessons.length, Math.floor(count / 2))} lessons from Oak`);
        }
    } catch (error) {
        console.log('⚠️  Oak API unavailable, continuing...');
    }

    // Try African Storybook
    try {
        const asb = new AfricanStorybookAPI();
        console.log('📖 Attempting African Storybook...');
        const stories = await asb.fetchStories('en');
        if (stories.length > 0) {
            lessons.push(...stories.slice(0, 3).map(s => asb.adaptToAALE(s)));
            console.log(`✓ Fetched ${Math.min(stories.length, 3)} stories`);
        }
    } catch (error) {
        console.log('⚠️  African Storybook unavailable, continuing...');
    }

    return lessons;
}

/**
 * Main: Fetch and save external content
 */
async function main() {
    try {
        console.log('🌐 AALE External Content Importer');
        console.log('━'.repeat(50) + '\n');

        const lessons = await fetchHybridContent(20);

        if (lessons.length > 0) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                for (const lesson of lessons) {
                    await client.query(
                        `INSERT INTO lessons (title, subject, difficulty, content_type, content_data)
             VALUES ($1, $2, $3, $4, $5)`,
                        [lesson.title, lesson.subject, lesson.difficulty, lesson.content_type, JSON.stringify(lesson.content_data)]
                    );
                }

                await client.query('COMMIT');
                console.log(`\n✅ Saved ${lessons.length} external lessons to database`);
            } finally {
                client.release();
            }
        } else {
            console.log('\n⚠️  No external content available. Check API connections.');
            console.log('💡 Recommendation: Use the AI generator instead.');
        }
    } catch (error) {
        console.error('❌ Import failed:', error.message);
    } finally {
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}

module.exports = { OakNationalAPI, AfricanStorybookAPI, fetchHybridContent };
