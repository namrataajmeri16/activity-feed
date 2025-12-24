# activity-feed
The system is designed for real claim events.  The activity feed supports both user-scoped and system-wide views. The same infrastructure can power member timelines, admin dashboards, and audit logs

The feed can be scoped per user for member views, or expanded to a global feed for admin and audit use cases. The backend uses cursor-based pagination so both scenarios scale efficiently.

Note : Run in bash terminal

<img width="1773" height="955" alt="Screenshot 2025-12-24 155704" src="https://github.com/user-attachments/assets/fccff28d-96f6-445a-ab22-567d6a4b232b" />

1. Run server 

    cd server
    
    npm run dev

2. Run worker in another terminal. Inside server folder itself

    npx ts-node-dev --respawn --transpile-only src/worker.ts

3. Run client 

    cd client 

    npm run dev

4. In new terminal. Root folder only

    a. Seed value by -> npx ts-node scripts/seedClaims.ts
        
        Expected output : 
            🌱 Seeding health & dental claim events...
            ✅ Inserted 6 claim events
            🔌 Database connection closed

    b. Verify if seeded valjues worked curl "http://localhost:4000/api/feed?limit=20"

How to deleted existeing seed value from db

Run inside Postgres (docker exec -it activity-feed-db-1 psql -U app -d feed):

    DELETE FROM activity_events
    WHERE message ILIKE '%Action event%'
    OR type = 'ACTION';

    OR

    TRUNCATE TABLE activity_events;
    
    then u can insert eg
    
    INSERT INTO activity_events (user_id, type, message)
    VALUES
    ('member_101', 'CLAIM_SUBMITTED', 'Dental claim submitted for $120'),
    ('member_101', 'UNDER_REVIEW', 'Claim is under review by benefits team'),
    ('member_101', 'APPROVED', 'Claim approved – coverage applied'),
    ('member_101', 'PAID', 'Payment of $96 issued to member');

