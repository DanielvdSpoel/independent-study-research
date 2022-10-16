var leaderboard;
var users = [];

function updateLeaderboard(leaderboardResponse) {
    leaderboard = leaderboardResponse;
    leaderboard.sort(function (a, b) {
        return b.points - a.points;
    });

    var place = 1;
    var number = 0;
    var whileStatus = true;

    while (whileStatus) {
        var element = document.getElementById('lb' + place);
        if(!element) return;
        var player = leaderboard[number];
        if(users.includes(player.player.number)) {
            number++;
        } else {
            var name = player.player.firstName + " " + player.player.lastName;
            element.innerText = `${place} ) ${name} - ${player.points} punten`;
            element.style.display = 'block';
            place++;
            number++;
            users.push(player.player.number);
        }
        if(leaderboard.length == number) {
            whileStatus = false;
        }
    }

}