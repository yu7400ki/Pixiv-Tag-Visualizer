const domParser = new DOMParser();

const _checkSvg = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M10.2426 16.3137L6 12.071L7.41421 10.6568L10.2426 13.4853L15.8995 7.8284L17.3137 9.24262L10.2426 16.3137Z"
  fill="currentColor"
/>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
  fill="currentColor"
/>
</svg>`;
const checkSvg = domParser.parseFromString(
  _checkSvg,
  "image/svg+xml"
).documentElement;

const _lockSvg = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M18 10.5C19.6569 10.5 21 11.8431 21 13.5V19.5C21 21.1569 19.6569 22.5 18 22.5H6C4.34315 22.5 3 21.1569 3 19.5V13.5C3 11.8431 4.34315 10.5 6 10.5V7.5C6 4.18629 8.68629 1.5 12 1.5C15.3137 1.5 18 4.18629 18 7.5V10.5ZM12 3.5C14.2091 3.5 16 5.29086 16 7.5V10.5H8V7.5C8 5.29086 9.79086 3.5 12 3.5ZM18 12.5H6C5.44772 12.5 5 12.9477 5 13.5V19.5C5 20.0523 5.44772 20.5 6 20.5H18C18.5523 20.5 19 20.0523 19 19.5V13.5C19 12.9477 18.5523 12.5 18 12.5Z"
  fill="currentColor"
/>
</svg>`;
const lockSvg = domParser.parseFromString(
  _lockSvg,
  "image/svg+xml"
).documentElement;

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
      wrapper.classList.add("gg-icon-check");
      wrapper.appendChild(checkSvg.cloneNode(true));
      el.appendChild(wrapper);
    }
    if (tags[tagName]?.locked) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("gg-icon-lock");
      wrapper.appendChild(lockSvg.cloneNode(true));
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
