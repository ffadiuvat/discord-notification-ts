import { Client, ClientOptions, TextChannel } from 'discord.js';

export class Discord extends Client{
  private defaultChannelID: string
  constructor(defaultChannelID: string){
    super({
      intents: [8]
    } as ClientOptions)
    this.defaultChannelID = defaultChannelID
  }

  public async getDefaultTextChannel() : Promise<TextChannel | null>{
    const defaultChannel = await this.channels.fetch(this.defaultChannelID)
    if (!defaultChannel || !(defaultChannel instanceof TextChannel)){
      return null
    }
    return defaultChannel
  }
}