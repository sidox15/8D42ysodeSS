    const sheetId = '15Zwzco81yazDgP851xY215bQDIZWzQKGPBMiTEnjEmg'; // معرف الجدول
    const apiKey = 'AIzaSyDiUpycgH_91SlW6fGvc_9m0G3vzbRXPCQ'; // مفتاح الـ API
    const range = 'A3:A'; // حدد النطاق الذي يحتوي على النطاقات

    document.getElementById('loginBtn').addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin@example.com' && password === 'password123') {
            localStorage.setItem('loggedIn', 'true'); // حفظ حالة تسجيل الدخول
            document.getElementById('loginForm').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            await fetchData();
        } else {
            document.getElementById('loginMessage').textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedIn'); // إزالة حالة تسجيل الدخول
        document.getElementById('loginForm').style.display = 'block';
        document.querySelector('.container').style.display = 'none';
    });

    async function fetchData() {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
        const data = await response.json();
        displayData(data.values);
    }

    function displayData(values) {
        const container = document.getElementById('domains-container');
        container.innerHTML = ''; // Clear previous data
        values.forEach((row, index) => {
            const domainRow = document.createElement('tr');
            domainRow.innerHTML = `
                <td>${row[0]}</td> <!-- Assuming the domain is in the first column -->
                <td>
                    <button onclick="deleteDomain(${index})">حذف</button>
                    <button onclick="editDomain('${row[0]}')">تعديل</button>
                </td>
            `;
            container.appendChild(domainRow);
        });
    }

    async function deleteDomain(index) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A3:A?key=${apiKey}`);
        const data = await response.json();
        const domains = data.values.map(row => row[0]);

        if (index >= 0 &amp; index < domains.length) {
            domains.splice(index, 1); // حذف النطاق من القائمة
            await updateSheet(domains);
            fetchData(); // تحديث البيانات بعد الحذف
        }
    }

    async function updateSheet(domains) {
        const resource = {
            values: domains.map(domain => [domain])
        };

        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A3:A?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // تأكد من أنك تستخدم توكن صالح
            },
            body: JSON.stringify(resource)
        });

        return response.json();
    }

    function editDomain(currentDomain) {
        const newDomain = prompt("تعديل النطاق:", currentDomain);
        if (newDomain) {
            updateSheetWithEdit(currentDomain, newDomain);
        }
    }

    async function updateSheetWithEdit(currentDomain, newDomain) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A3:A?key=${apiKey}`);
        const data = await response.json();
        const domains = data.values.map(row => row[0]);

        const index = domains.indexOf(currentDomain);
        if (index !== -1) {
            domains[index] = newDomain; // تعديل النطاق
            await updateSheet(domains);
            fetchData(); // تحديث البيانات بعد التعديل
        }
    }

    window.onload = () => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn) {
            document.getElementById('loginForm').style.display = 'none';
            document.querySelector('.container').style.display = 'block';
            fetchData();
        }
    };
