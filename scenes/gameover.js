export default function GameOver(score) {
  add([
    text(`Game Over! Score: ${score}`, { font: "sink", size: 60 }),
    origin("center"),
    pos(width() / 2, height() / 2 - 200),
  ]);

  add([
    text("Press space to play again", { font: "sink", size: 40 }),
    origin("center"),
    pos(width() / 2, height() / 2 + 100),
  ]);

  keyPress("space", () => {
    go("game");
  });
}
