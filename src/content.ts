import { Setting } from './service/Chrome';
import { Illust, Novel } from './service/Pixiv';
import { Tags } from './types/pixiv';

const getIllustId = (href: string) => {
  const illustId = href.match(/^https:\/\/www.pixiv.net\/artworks\/(\d+)$/);

  if (!illustId) return null;
  return illustId[1];
};

const getNovelId = (href: string) => {
  const novelId = href.match(
    /^https:\/\/www.pixiv.net\/novel\/show\.php\?id=(\d+)$/,
  );

  if (!novelId) return null;
  return novelId[1];
};

const getTagDom = () => {
  return document.querySelector('ul.sc-pj1a4x-0.gZfuPH');
};

const removeBadge = () => {
  const badged = document.querySelectorAll('[class^="gg-icon"]');
  badged.forEach((el) => el.remove());
};

const removeDisable = () => {
  const disable = document.querySelectorAll('.disable-tag');
  disable.forEach((el) => el.classList.remove('disable-tag'));
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkBadge = () => {
  const wrapper = document.createElement('span');
  wrapper.classList.add('gg-icon-check');
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('assets/check.svg');
  wrapper.appendChild(img);
  return wrapper;
};

const lockBadge = () => {
  const wrapper = document.createElement('span');
  wrapper.classList.add('gg-icon-lock');
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('assets/lock.svg');
  wrapper.appendChild(img);
  return wrapper;
};

const editBadge = async (href: string) => {
  const illustId = getIllustId(href);
  const novelId = getNovelId(href);

  if (!illustId && !novelId) return;

  await sleep(1000);
  while (!getTagDom()) {
    await sleep(500);
  }

  removeBadge();
  removeDisable();

  const contents = await (async () => {
    if (illustId) {
      return await Illust.init(Number(illustId));
    } else {
      return await Novel.init(Number(novelId));
    }
  })();
  const tagDom = getTagDom()?.querySelectorAll('li');
  const setting = await Setting.get();
  const tags = contents.tags();
  const authorId = contents.author;

  console.log(tags);

  tagDom?.forEach((el) => {
    el.classList.add('tag-li');
    const link = el.querySelector('a.gtm-new-work-tag-event-click');
    if (!link) return;

    el.classList.add('disable-tag');

    const tagName = link.textContent as keyof Tags;
    if (!tagName) return;

    if (tags[tagName]?.userId?.toString() === authorId) {
      if (setting['author-tag']) {
        el.classList.remove('disable-tag');

        if (setting['author-badge']) {
          el.appendChild(checkBadge());
        }
      }
    } else if (tags[tagName]?.locked) {
      if (setting['lock-tag']) {
        el.classList.remove('disable-tag');

        if (setting['lock-badge']) {
          el.appendChild(lockBadge());
        }
      }
    } else if (setting['other-tag']) {
      el.classList.remove('disable-tag');
    }
  });
};

window.addEventListener('load', async () => {
  await Setting.init();

  let href = window.location.href;
  const body = document.querySelector('body');
  if (!body) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(async () => {
      if (href !== window.location.href) {
        href = window.location.href;
        await editBadge(href);
      }
    });
  });

  const setting = {
    childList: true,
    subtree: true,
  };

  observer.observe(body, setting);
  await editBadge(href);
});
