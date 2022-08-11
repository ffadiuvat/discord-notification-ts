import { Arguments, CommandBuilder } from 'yargs';
import App from '../../src/pkg/app';
import Instagram from '.././pkg/instagram';

type Options = {
  username: string,
  period: number,
}

export const command = 'ig-notification <username>';
export const desc = 'Get notification from <username> latest post that we subscribe';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      interval: {
        type: 'number',
        alias: 'i',
        demandOption: true
      },
      keywords: {
        type: 'string',
        alias: 'k'
      },
      timeout: {
        type: 'number',
        alias: 't'
      }
    })
    .positional('username', { type: 'string', demandOption: true });


export const handler = async (argv: Arguments) => {
  const { username, interval, keywords, timeout } = argv;
  try {
    const app = await App.getInstance();
    const ig = new Instagram();
    ig.authWithSessionAndAppID(process.env.IG_SESSION_ID as string, process.env.IG_APP_ID as string);

    if (keywords) {
      if (typeof keywords == 'string') {
        ig.setKeyword(keywords);
      } else {
        for (const word in keywords as Array<string>) {
          ig.setKeyword(word);
        }
      }
    }

    app.discord?.once('ready', async () => {
      const guild = await app.discord?.getDefaultTextChannel();
      await poll(interval as number, timeout as number, async () => {
        console.log(`polling from instagram @${username}`);
        const post = await ig.getLatestPostWithKeyword(username as string);
        if (ig.shouldSendNotification(post)) {
          guild?.send(`Silahkan check post ${post.url}`);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const poll = async function (interval: number, timeout: number, cb: () => any) {
  const startDate = new Date();
  console.log('polling started');
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isExceedTimeout(startDate, new Date(), timeout)) {
      console.log('timeout exceeded, terminating polling');
      setTimeout(process.exit(0), 2);
    }
    await cb();
    await sleep(interval * 1000);
  }
};

const isExceedTimeout = function (startDate: Date, currentDate: Date, timeout: number) {
  if (
    (currentDate.getTime() - startDate.getTime())
    / 1000
    >=
    timeout) {
    return true;
  }
  return false;
};

const sleep = async function (interval: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, interval));
};