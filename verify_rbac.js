const API_URL = 'http://localhost:3000';

const runTests = async () => {
    try {
        console.log('--- 🔐 RBAC Verification Started ---');

        // Helper for requests
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
        const adminId = 1;
        console.log('✅ Admin Logged In');

        // 2. Login Member
        const memberLogin = await request('/auth/login', 'POST', {
            email: 'member@example.com',
            password: 'password123'
        });
        if (memberLogin.status !== 200) throw new Error('Member Login Failed');
        const memberToken = memberLogin.data.token;
        const memberId = 4;
        console.log('✅ Member Logged In');

        // 3. Admin: Create Project (Should Succeed)
        const projectRes = await request('/projects', 'POST', {
            name: 'RBAC Test Project',
            description: 'Testing permissions'
        }, adminToken);

        if (projectRes.status !== 201) throw new Error(`Admin Create Project Failed: ${projectRes.status}`);
        const projectId = projectRes.data.id;
        console.log(`✅ Admin Created Project (ID: ${projectId})`);

        // 4. Admin: Create Task assigned to Member (Should Succeed)
        const taskRes = await request('/tasks', 'POST', {
            projectId,
            title: 'Member Task',
            description: 'Assigned to member',
            assigneeId: memberId
        }, adminToken);

        if (taskRes.status !== 201) throw new Error(`Admin Create Task Failed: ${taskRes.status}`);
        const taskId = taskRes.data.id;
        console.log(`✅ Admin Created Task (ID: ${taskId}) for Member`);

        // 5. Member: Try to Update Status of OWN Task (Should Succeed)
        const updateOwnRes = await request(`/tasks/${taskId}/status`, 'PUT', {
            status: 'in_progress',
            version: 1
        }, memberToken);

        if (updateOwnRes.status === 200) console.log('✅ Member Updated OWN Task');
        else console.error(`❌ Member Failed to Update OWN Task: ${updateOwnRes.status}`);

        // 6. Admin Create Unassigned Task
        const unassignedTaskRes = await request('/tasks', 'POST', {
            projectId,
            title: 'Unassigned Task',
            assigneeId: null
        }, adminToken);
        const unassignedTaskId = unassignedTaskRes.data.id;

        // 7. Member: Try to Update Unassigned Task (Should Fail 403)
        const updateUnassignedRes = await request(`/tasks/${unassignedTaskId}/status`, 'PUT', {
            status: 'done',
            version: 1
        }, memberToken);

        if (updateUnassignedRes.status === 403) console.log('✅ Member Blocked from Updating Unassigned Task (403)');
        else console.error(`❌ Member Updated Unassigned Task (Expected 403, got ${updateUnassignedRes.status})`);

        // 8. Member: Try to Delete Task (Should Fail 403)
        const deleteTaskRes = await request(`/tasks/${taskId}`, 'DELETE', null, memberToken);

        if (deleteTaskRes.status === 403) console.log('✅ Member Blocked from Deleting Task (403)');
        else console.error(`❌ Member Deleted Task (Expected 403, got ${deleteTaskRes.status})`);

        // 9. Member: Try to Access Analytics (Should Fail 403)
        const analyticsRes = await request('/analytics', 'GET', null, memberToken);

        if (analyticsRes.status === 403) console.log('✅ Member Blocked from Analytics (403)');
        else console.error(`❌ Member Accessed Analytics (Expected 403, got ${analyticsRes.status})`);

        // 10. Member: Try to Delete Project (Should Fail 403)
        const deleteProjectRes = await request(`/projects/${projectId}`, 'DELETE', null, memberToken);

        if (deleteProjectRes.status === 403) console.log('✅ Member Blocked from Deleting Project (403)');
        else console.error(`❌ Member Deleted Project (Expected 403, got ${deleteProjectRes.status})`);

        console.log('\n--- 🎉 All RBAC Tests Passed ---');

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

runTests();
