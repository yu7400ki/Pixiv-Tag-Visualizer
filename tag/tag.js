const href = window.location.href;

let html;
fetch(href)
  .then((response) => {
    if (response.ok) {
      return response.text();
    }
    throw new Error("This page is not available");
  })
  .then((text) => {
    html = text;
  })
  .catch((error) => {
    console.log(error);
  });

const getTags = (doc) => {
  const preloadData = JSON.parse(
    doc.getElementById("meta-preload-data").content
  )
  const _tags = preloadData.illust[getIllustId(href)].tags.tags;
  let tags = {};
  _tags.forEach((tag) => {
    tags[tag.tag] = tag;
  });
  return tags;
}

const getIllustId = (href) => {
  const illustId = href.match(/https:\/\/www.pixiv.net\/artworks\/(\d+)/);
  return illustId[1];
};

const getAuthorId = (doc) => {
  const preloadData = JSON.parse(
    doc.getElementById("meta-preload-data").content
  )
  return preloadData.illust[getIllustId(href)].tags.authorId;
};

window.addEventListener("load", () => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, "text/html");

  const authorId = getAuthorId(doc);
  const tags = getTags(doc);

  const tagDom = document.getElementsByClassName("gtm-new-work-tag-event-click");

  for (let i = 0; i < tagDom.length; i++) {
    const tagName = tagDom[i].innerText;
    if (tags[tagName]?.userId === authorId) {
      const checkIcon = document.createElement("img");
      checkIcon.src = "https://css.gg/check-o.svg";
      checkIcon.classList.add("gg-icon");
      tagDom[i].parentElement.appendChild(checkIcon);
    }
    if (tags[tagName].locked) {
      const lockIcon = document.createElement("img");
      lockIcon.src = "https://css.gg/lock.svg";
      lockIcon.classList.add("gg-icon");
      tagDom[i].parentElement.appendChild(lockIcon);
    }
  }
});
