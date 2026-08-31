import pool from './src/db.js';

async function update() {
    try {
        await pool.query("UPDATE maintenance_requests SET scheduled_date = CURRENT_DATE() WHERE type = 'Preventive'");
        console.log("Updated preventive requests to today's date.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

update();
