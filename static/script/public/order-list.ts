import { moneyFormatter } from "./script";

const socket = io.connect("http://localhost:6743");

socket.on('connect', () => {
  console.log("!connect socket.io!");
});
