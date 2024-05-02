export class BetInfo {
    username;
    id;
    betValue;
    horseIdx;
    horseId;
    constructor(username, id, betValue, horseIdx, horseId) {
        this.username = username;
        this.id = id;
        this.betValue = betValue;
        this.horseIdx = horseIdx;
        this.horseId = horseId;
    }
}
