const href = window.location.href;

const getIllustId = (href) => {
  const illustId = href.match(/https:\/\/www.pixiv.net\/artworks\/(\d+)/);
  return illustId[1];
};

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

window.addEventListener("load", () => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, "text/html");
  const preloadData = JSON.parse(
    doc.getElementById("meta-preload-data").content
  );
  
  const authorId = preloadData.illust[getIllustId(href)].tags.authorId;
  const tags = preloadData.illust[getIllustId(href)].tags.tags;
  console.log(authorId, tags);
});
