import { ExtensionSettings } from '../types/setting';

export class Setting {
  static async init(force = false) {
    const result = await Setting.get();
    if (result && !force) {
      return result;
    }
    const setting = {
      'author-badge': true,
      'lock-badge': true,
      'author-tag': true,
      'lock-tag': true,
      'other-tag': true,
    };
    return await Setting.set(setting);
  }

  static async get(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      chrome.storage.local.get('tag_setting', (result) => {
        resolve(result.tag_setting as ExtensionSettings);
      });
    });
  }

  static async set(setting: ExtensionSettings): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ tag_setting: setting }, () => {
        resolve(setting as ExtensionSettings);
      });
    });
  }
}
