chrome.storage.local.get("tag_setting", (result) => {
  if (!result.tag_setting) {
    const tag_setting = {
      "author-mark": true,
      "lock-mark": true,
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

const setSetting = (setting) =>
  new Promise((resolve) => {
    chrome.storage.local.set({ tag_setting: setting }, () => {
      resolve();
    });
  });

const updateSetting = async (update) => {
  const setting = await getSetting();
  const newSetting = { ...setting, ...update };
  await setSetting(newSetting);
  return newSetting;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener("load", async () => {
  const checkbox = document.querySelectorAll("input[type=checkbox]");
  while (!(await getSetting())) {
    await sleep(100);
  }
  const setting = await getSetting();
  checkbox.forEach((el) => {
    el.checked = setting[el.name];
    el.addEventListener("change", async () => {
      await updateSetting({ [el.name]: el.checked });
    });
  });
});
