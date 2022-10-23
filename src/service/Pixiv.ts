import { IllustResponse, NovelResponse, Tags } from '../types/pixiv';

export class Illust {
  illust: IllustResponse;

  constructor(illust: IllustResponse) {
    this.illust = illust;
  }

  static async init(illustId: number) {
    const response = await fetch(
      `https://www.pixiv.net/ajax/illust/${illustId}`,
    );
    const illust: IllustResponse = await response.json();
    return new Illust(illust);
  }

  get author() {
    return this.illust.body.userId;
  }

  tags() {
    const _tags = this.illust.body.tags.tags;
    const tags: Tags = {};
    _tags.forEach((tag) => {
      tags[tag.tag] = tag;
    });
    return tags;
  }
}

export class Novel {
  novel: NovelResponse;

  constructor(novel: NovelResponse) {
    this.novel = novel;
  }

  static async init(novelId: number) {
    const response = await fetch(`https://www.pixiv.net/ajax/novel/${novelId}`);
    const novel: NovelResponse = await response.json();
    return new Novel(novel);
  }

  get author() {
    return this.novel.body.userId;
  }

  tags() {
    const _tags = this.novel.body.tags.tags;
    const tags: Tags = {};
    _tags.forEach((tag) => {
      tags[tag.tag] = tag;
    });
    return tags;
  }
}
