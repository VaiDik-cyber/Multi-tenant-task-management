const API_URL = 'http://localhost:3000';

const runTests = async () => {
    try {
        console.log('--- 👥 User Management Verification Started ---');

        const request = async (url, method, body, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const options = {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            };

            const res = await fetch(`${API_URL}${url}`, options);
            const data = await res.json().catch(() => ({}));

            return {
                status: res.status,
                data
            };
        };

        // 1. Login Admin
        const adminLogin = await request('/auth/login', 'POST', {
            email: 'admin@example.com',
            password: 'password123'
        });
        if (adminLogin.status !== 200) throw new Error('Admin Login Failed');
        const adminToken = adminLogin.data.token;
        console.log('✅ Admin Logged In');

        // 2. List Users (Should be able to see existing)
        const listRes = await request('/auth/users', 'GET', null, adminToken);
        if (listRes.status !== 200) throw new Error(`Admin List Users Failed: ${listRes.status}`);
        console.log(`✅ Admin Listed ${listRes.data.length} Users`);

        // 3. Create New Member
        const newMemberEmail = `newmember_${Date.now()}@test.com`;
        const createRes = await request('/auth/users', 'POST', {
            username: 'New Member',
            email: newMemberEmail,
            password: 'password123',
            role: 'user'
        }, adminToken);

        if (createRes.status !== 201) throw new Error(`Admin Create User Failed: ${createRes.status} ${JSON.stringify(createRes.data)}`);
        console.log(`✅ Admin Created New User: ${createRes.data.email}`);

        // 4. Verify New User in List
        const listRes2 = await request('/auth/users', 'GET', null, adminToken);
        const exists = listRes2.data.some(u => u.email === newMemberEmail);
        if (!exists) throw new Error('New user not found in list');
        console.log('✅ Verified New User in List');

        // 5. Try to Create User as Non-Admin (Should Fail)
        // Login as the NEW user
        const memberLogin = await request('/auth/login', 'POST', {
            email: newMemberEmail,
            password: 'password123'
        });
        const memberToken = memberLogin.data.token;

        const failCreateRes = await request('/auth/users', 'POST', {
            username: 'Hacker',
            email: 'hacker@test.com',
            password: '123'
        }, memberToken);

        if (failCreateRes.status === 403) console.log('✅ Member Blocked from Creating User (403)');
        else console.error(`❌ Member Created User (Expected 403, got ${failCreateRes.status})`);

        console.log('\n--- 🎉 User Management Tests Passed ---');

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

runTests();
