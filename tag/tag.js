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

  console.log(authorId, tags);
});
