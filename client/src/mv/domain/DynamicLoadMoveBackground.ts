import Phaser from "phaser";


export class DynamicLoadMoveBackground
{
  async load(scene: Phaser.Scene)
  {
    var name = "card-back";
    // texture needs to be loaded to create a placeholder card
    let loader = new Phaser.Loader.LoaderPlugin(scene);

    // ask the LoaderPlugin to load the texture
    loader.image(name, "https://phaser.io/images/sponsors/twilio300.png");
    loader.once(Phaser.Loader.Events.COMPLETE, () =>
    {
      // texture loaded so use instead of the placeholder
      const card = scene.add.image(200, 200, name);
      const cardInter = setInterval(() =>
      {
        card.setPosition(card.x + 1, card.y + 1);
        if (card.x > scene.game.config.width)
        {
          clearInterval(cardInter);
        }
      }, 1000 / 60);
      card.setTexture(name);
      card.setDepth(1);
    });
    loader.start();
  }

}
