export default function Landing() {
  add([sprite("landing"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("Press space to start!", { font: "sink", size: 30 }),
    pos(width() / 2, height() - 30),
    origin("center"),
  ]);
  keyPress("space", () => {
    go("game", (score = 0));
  });
}
