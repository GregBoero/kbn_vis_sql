
import {createGetterSetter, DataPublicPluginStart, IUiSettingsClient, NotificationsStart} from "../common/import";


export const [getData, setData] = createGetterSetter<DataPublicPluginStart>('Data');

export const [getNotifications, setNotifications] = createGetterSetter<NotificationsStart>(
  'Notifications'
);
export const [getUISettings, setUISettings] = createGetterSetter<IUiSettingsClient>('UISettings');


