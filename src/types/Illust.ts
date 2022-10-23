export type IllustResponse = {
  error: boolean;
  message: string;
  body: IllustBody;
};

export type IllustBody = {
  illustId: string;
  illustTitle: string;
  illustComment: string;
  id: string;
  title: string;
  description: string;
  illustType: number;
  createDate: string;
  uploadDate: string;
  restrict: number;
  xRestrict: number;
  sl: number;
  urls: Urls;
  tags: Tag;
  alt: string;
  storableTags: string[];
  userId: string;
  userName: string;
  userAccount: string;
};

export type Urls = {
  original: string;
  regular: string;
  small: string;
  thumb: string;
  mini: string;
};

export type Tag = {
  authorId: string;
  isLocked: boolean;
  tags: {
    tag: string;
    locked: boolean;
    deletable: boolean;
    userId?: number;
    userName?: string;
  }[];
};

export type Tags = Record<
  string,
  {
    tag: string;
    locked: boolean;
    deletable: boolean;
    userId?: number;
    userName?: string;
  }
>;
