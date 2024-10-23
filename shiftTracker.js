function getRobloxAvatarUrl(userId) {
    return `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=true`;
}

async function fetchShiftData() {
    try {
        const response = await fetch('https://shift-tracker-gamma.vercel.app/api/shiftData');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const players = await response.json();
        updateDisplay(players);
    } catch (error) {
        console.error('Error fetching shift data:', error);
    }
}
    

function updateDisplay(players) {
    const weekTablesDiv = document.getElementById('weekTables');
    weekTablesDiv.innerHTML = '';

    // Group players by week
    const playersByWeek = groupByWeek(players);

    for (const [week, players] of Object.entries(playersByWeek)) {
        const table = document.createElement('table');
        const thead = `
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>Username</th>
                    <th>Total Time (minutes)</th>
                    <th>Date</th>
                </tr>
            </thead>
        `;
        table.innerHTML = thead;
        const tbody = document.createElement('tbody');

        for (const player of players) {
            // Debugging check to see if the date is correctly sent
            console.log('Player date:', player.date);

            // Default to "N/A" if date is missing
            const displayDate = player.date ? player.date : 'N/A';

            const row = `
                <tr>
                    <td><img class="avatar" src="${player.avatarUrl}" alt="${player.username}"></td>
                    <td>${player.username}</td>
                    <td>${player.totalTime}</td>
                    <td>${displayDate}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        }

        table.appendChild(tbody);
        weekTablesDiv.appendChild(table);
    }
}

function groupByWeek(players) {
    // Group players by week based on the date
    const result = {};
    players.forEach(player => {
        const week = getWeek(player.date);
        if (!result[week]) {
            result[week] = [];
        }
        result[week].push(player);
    });
    return result;
}

function getWeek(dateString) {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Poll the server every 5 seconds for updated shift data
setInterval(fetchShiftData, 5000);

// Navigation handling
document.getElementById('homeLink').addEventListener('click', function() {
    document.getElementById('weekTables').classList.add('hidden');
    document.getElementById('homeContent').classList.remove('hidden');
});

document.getElementById('tablesLink').addEventListener('click', function() {
    document.getElementById('homeContent').classList.add('hidden');
    document.getElementById('weekTables').classList.remove('hidden');
});

// Fetch shift data on page load
fetchShiftData();
