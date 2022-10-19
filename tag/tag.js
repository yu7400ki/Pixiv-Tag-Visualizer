const getIllustId = (href) => {
  const illustId = href.match(/https:\/\/www.pixiv.net\/artworks\/(\d+)/);
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

const addBadge = async (href) => {
  if (!href.match(/https:\/\/www.pixiv.net\/artworks\/\d+/)) return;
  const response = await fetch(href);
  const html = await response.text();

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, "text/html");

  const illustId = getIllustId(href);
  const authorId = getAuthorId(doc, illustId);
  const tags = getTags(doc, illustId);
  console.log(tags);

  await sleep(500);
  while (getTagDom() === null) {
    await sleep(100);
  }

  const badged = document.querySelectorAll('[class^="gg-icon"]');
  badged.forEach((el) => el.remove());

  const tagDom = getTagDom().querySelectorAll("li");

  tagDom.forEach((el) => {
    el.classList.add("tag-li");
    const link = el.querySelector("a");
    if (!link) return;
    const tagName = link.textContent;
    if (tags[tagName]?.userId === authorId) {
      const wrapper = document.createElement("div");
      const checkIcon = document.createElement("img");
      checkIcon.src = "https://css.gg/check-o.svg";
      wrapper.classList.add("gg-icon-check");
      wrapper.appendChild(checkIcon);
      el.appendChild(wrapper);
    }
    if (tags[tagName]?.locked) {
      const wrapper = document.createElement("div");
      const lockIcon = document.createElement("img");
      lockIcon.src = "https://css.gg/lock.svg";
      wrapper.classList.add("gg-icon-lock");
      wrapper.appendChild(lockIcon);
      el.appendChild(wrapper);
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
