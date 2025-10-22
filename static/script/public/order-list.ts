import { moneyFormatter } from "./script";

const socket = io.connect("https://order.nfolio.one");

socket.on('connect', () => {
  console.log("!connect socket.io!");
});
