export class BetInfo {
  username: string
  id: string;
  betValue: number;
  horseIdx: number;
  horseId: string;

  constructor(username: string, id: string, betValue: number, horseIdx: number, horseId: string) {
    this.username = username;
    this.id = id;
    this.betValue = betValue;
    this.horseIdx = horseIdx;
    this.horseId = horseId;
    
}