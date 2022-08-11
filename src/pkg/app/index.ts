import { Discord } from '../../../src/pkg/bot';
export class App {
  public discord: Discord | undefined;
  private static instance: App;
  private constructor() {
    this.initBotClient();
  }

  public static async getInstance(): Promise<App> {
    if (!App.instance) {
      App.instance = new App();
    }

    return App.instance;
  }

  private async initBotClient() {
    this.discord = new Discord(process.env.DISCORD_DEFAULT_CHANNEL as string)
    try {
      await this.discord.login(process.env.DISCORD_BOT_TOKEN as string);
    } catch (e) {
      console.log(e)
    }
  }
}