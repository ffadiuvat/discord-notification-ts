import axios, { AxiosInstance } from 'axios';

type Post = {
  id: string,
  url: string,
  caption: string
}
export default class Instagram {
  private sessionID: string;

  private keywords: string[];

  private a: AxiosInstance;

  private cache: Map<string, string>;

  private appID: string;

  constructor() {
    this.sessionID = '';
    this.appID = '';
    this.keywords = [];
    this.a = axios.create({ baseURL: 'https://i.instagram.com/' });
    this.cache = new Map<string, string>();
  }

  public authWithSessionAndAppID(sessionID: string, appID: string) {
    this.sessionID = sessionID;
    this.appID = appID;
  }

  public setKeyword(keyword: string) {
    this.keywords.push(keyword);
  }

  public async getLatestPostWithKeyword(username: string): Promise<Post> {
    const uri = `/api/v1/feed/user/${username}/username`;
    const result = await this.a.get(uri, {
      headers: {
        Cookie: `sessionid=${this.sessionID}`,
        'x-ig-app-id': this.appID,
      },
    });
    const latestPost = result.data.items[0];
    const postURL = `https://instagram.com/p/${latestPost.code}`;
    return {
      id: latestPost.id,
      url: postURL,
      caption: latestPost.caption.text.toLowerCase(),
    } as Post;
  }

  public shouldSendNotification(post: Post) {
    if (this.cache.get(post.id)) {
      return false;
    }

    if (this.keywords.length <= 0) {
      this.cache.set(post.id, post.url);
      return true;
    }

    let result = false;
    this.keywords.forEach((value) => {
      if (post.caption.includes(value)) {
        result = true;
      }
    });

    return result;
  }
}
