
function Players() {
    this.data = cookieObject.get('players');
    this.get = function () {
        return this.data.players;
    }
    this.add = function (player) {
        this.data.players.push(player);
        cookieObject.set('players', this.data);
    }
    this.remove = function (player) {
        var index = this.data.players.indexOf(player);
        if (index > -1) this.data.players.splice(index, 1);
        cookieObject.set('players', this.data);
    }
    this.setCurrent = function (player) {
        this.data.current = player;
    }
}
$(function () {
    players = new Players();
});
