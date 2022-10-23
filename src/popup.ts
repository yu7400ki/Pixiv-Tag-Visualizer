import { Setting } from './service/Chrome';
import { ExtensionSettings } from './types/setting';

const updateSetting = async (update: ExtensionSettings) => {
  const setting = await Setting.get();
  const newSetting = { ...setting, ...update };
  await Setting.set(newSetting);
};

window.addEventListener('load', async () => {
  await Setting.init();
  const checkbox = document.querySelectorAll(
    'input[type=checkbox]',
  ) as NodeListOf<HTMLInputElement>;
  const setting = await Setting.get();
  checkbox.forEach((el) => {
    el.checked = setting[el.name as keyof ExtensionSettings];
    el.addEventListener('change', async () => {
      await updateSetting({ [el.name]: el.checked } as ExtensionSettings);
    });
  });
});
