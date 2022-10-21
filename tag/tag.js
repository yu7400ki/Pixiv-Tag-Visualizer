chrome.storage.local.get("tag_setting", (result) => {
  if (!result.tag_setting) {
    const tag_setting = {
      "author-badge": true,
      "lock-badge": true,
      "author-tag": true,
      "lock-tag": true,
      "other-tag": true,
    };
    chrome.storage.local.set({ tag_setting });
  }
});

const getSetting = () =>
  new Promise((resolve) => {
    chrome.storage.local.get("tag_setting", (result) => {
      resolve(result.tag_setting);
    });
  });

const domParser = new DOMParser();

const _checkSvg = `<svg role="img" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" aria-labelledby="circleOkIconTitle" stroke="#FFF" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#FFF"> <title id="circleOkIconTitle">投稿者指定のタグ</title> <polyline points="7 13 10 16 17 9"/> <circle cx="12" cy="12" r="10"/> </svg>`;
const checkSvg = domParser.parseFromString(
  _checkSvg,
  "image/svg+xml"
).documentElement;

const _lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-labelledby="lockIconTitle"><title id="lockIconTitle">ロックされたタグ</title><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
const lockSvg = domParser.parseFromString(
  _lockSvg,
  "image/svg+xml"
).documentElement;

const getIllustId = (href) => {
  const illustId = href.match(/^https:\/\/www.pixiv.net\/artworks\/(\d+)$/);
  return illustId[1];
};

const getTags = (doc, id) => {
  const preloadData = JSON.parse(
    doc.getElementById("meta-preload-data").content
  );
  const _tags = preloadData.illust[id].tags.tags;
  let tags = {};
  _tags.forEach((tag) => {
    tags[tag.tag] = tag;
  });
  return tags;
};

const getAuthorId = (doc, id) => {
  const preloadData = JSON.parse(
    doc.getElementById("meta-preload-data").content
  );
  return preloadData.illust[id].tags.authorId;
};

const getTagDom = () => {
  return document.querySelector("ul.sc-pj1a4x-0.gZfuPH");
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const removeBadge = () => {
  const badged = document.querySelectorAll('[class^="gg-icon"]');
  badged.forEach((el) => el.remove());
};

const removeDisable = () => {
  const disable = document.querySelectorAll(".disable-tag");
  disable.forEach((el) => el.classList.remove("disable-tag"));
};

const checkBadge = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("gg-icon-check");
  wrapper.setAttribute("data-descr", "投稿者指定のタグ");
  wrapper.appendChild(checkSvg.cloneNode(true));
  return wrapper;
};

const lockBadge = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("gg-icon-lock");
  wrapper.setAttribute("data-descr", "ロックされたタグ");
  wrapper.appendChild(lockSvg.cloneNode(true));
  return wrapper;
};

const addBadge = async (href) => {
  if (!href.match(/^https:\/\/www.pixiv.net\/artworks\/\d+$/)) return;
  const response = await fetch(href);
  const html = await response.text();

  const doc = domParser.parseFromString(html, "text/html");

  const illustId = getIllustId(href);
  const authorId = getAuthorId(doc, illustId);
  const tags = getTags(doc, illustId);
  console.log(tags);

  await sleep(500);
  while (getTagDom() === null) {
    await sleep(100);
  }

  while (!(await getSetting())) {
    await sleep(100);
  }
  const setting = await getSetting();

  removeBadge();
  removeDisable();

  const tagDom = getTagDom().querySelectorAll("li");

  tagDom.forEach((el) => {
    el.classList.add("tag-li");
    const link = el.querySelector("a.gtm-new-work-tag-event-click");
    if (!link) return;
    el.classList.add("disable-tag");
    const tagName = link.textContent;
    let other = true;

    if (tags[tagName]?.userId === authorId) {
      other = false;
      if (setting["author-badge"]) {
        el.appendChild(checkBadge());
      }
      if (setting["author-tag"]) {
        el.classList.remove("disable-tag");
      }
    } else if (tags[tagName]?.locked) {
      other = false;
      if (setting["lock-badge"]) {
        el.appendChild(lockBadge());
      }
      if (setting["lock-tag"]) {
        el.classList.remove("disable-tag");
      }
    }

    if (other && setting["other-tag"]) {
      el.classList.remove("disable-tag");
    }
  });
};

window.addEventListener("load", async () => {
  let href = window.location.href;
  const body = document.body;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(async (mutation) => {
      if (href !== window.location.href) {
        href = window.location.href;
        await addBadge(href);
      }
    });
  });

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(body, config);
  await addBadge(href);
});
