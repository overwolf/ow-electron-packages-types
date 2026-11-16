/**
 * The *Content Recommendation Notification* (CRN) APIs give you tools to help manage the content notification settings in your app. 
 * 
 * CRN is a tool that recommends new apps for players that could offer them more value, and enhance their gaming experience.
 * 
 * @packageDocumentation
 */
// -----------------------------------------------------------------------------

/**
 * Used to create cancellable or abortable event.
 *
 * @example
 * crnApi.on('before-notification', (event: ICRNEvent) => {
 *  // Check if the notification should be shown
 *  if (!shouldShowNotification()) {
 *    event.abort();
 *   }
 * });
 *
 */
export interface ICRNEvent {
  /**
   *  Cancels the ongoing event, stopping its propagation or execution.
   * 
   */
  abort: () => void;
}



/**
 * All supported notification actions.
 *
 * Represents the different ways a user or the system can
 * interact with or dismiss a notification. It is useful for analytics,
 * handling UI state changes, or triggering specific behavior based on
 * user intent or automated conditions.
 *
 * | Value                                       | Description                                                                                      |
 * | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
 * | `'Dismissed'`                               | User clicked on the `X` button to dismiss the notification.                                      |
 * | `'OpenApplicationInStore'`                  | User clicked on a notification that opens the recommended app's page in the Overwolf store.      |
 * | `'DirectInstallApplication'`                | User clicked on a notification that installs the recommended app directly.                       |
 * | `'IgnoredByLaunchingGame'`                  | Notification closed due to launching another game while the notification is displayed.           |
 * | `'Timeout'`                                 | Notification automatically closed after no user action was registered.                           |
 * | `'TurnOffNotificationsRequested'`           | User clicked on `Turn off notifications` from the cogwheel icon.                                 |
 * | `'NotificationSettingsOpened'`              | User clicked on `Notification settings` from the cogwheel icon.                                  |
 * | `'OpenExternalUrl'`                       | User clicked on a notification that opens an external URL (e.g., newsletter site).               |
 * | `'DownloadExternalApp'`                     | User clicked on a notification that downloads an external app.                                   |
 * | `'CancelDownloadExternalApp'`               | User clicked on the `Cancel` button while the external app was downloading.                      |
 * | `'CloseClickedWhileDownloadingExternalApp'` | User clicked on the `X` button while the external app was downloading.                           |
 * | `'ForceClosed'`                             | Developer programmatically closed the notification using the `closeNotificationWindow()` method. |
 *
 * @example
 * crnApi.on('notification-action', (action: CRNActionType) => {
 *   if (action === 'Dismissed') {
 *     // Count the dismissal for internal analytics
 *   }
 * });
 * 
 */
export type CRNActionType =
  /**
   * User clicked on the `X` button to dismiss the notification.
   */
  | 'Dismissed'
  /**
   * User clicked on a notification that opens the recommended app's page in the Overwolf store.
   */
  | 'OpenApplicationInStore'
  /**
   * User clicked on a notification that installs the recommended app directly.
   */
  | 'DirectInstallApplication'
  /**
   * Notification closed due to launching another game while the notification is displayed.
   */
  | 'IgnoredByLaunchingGame'
  /**
   * Notification automatically closed after no user action was registered.
   */
  | 'Timeout'
  /**
   * User clicked on `Turn off notifications` from the cogwheel icon.
   */
  | 'TurnOffNotificationsRequested'
  /**
   * User clicked on `Notification settings` from the cogwheel icon.
   */
  | 'NotificationSettingsOpened'
  /**
   * User clicked on a notification that opens an external URL (e.g., newsletter site).
   */
  | 'OpenExternalUrl'
  /**
   * User clicked on a notification that downloads an external app.
   */
  | 'DownloadExternalApp'
  /**
   * User clicked on the `Cancel` button while the external app was downloading.
   */
  | 'CancelDownloadExternalApp'
  /**
   * User clicked on the `X` button while the external app was downloading.
   */
  | 'CloseClickedWhileDownloadingExternalApp'
  /**
   * Developer programmatically closed the notification using the `closeNotificationWindow()` method.
   */
  | 'ForceClosed';



/**
 * Interface for interacting with the Overwolf *Content Recommendation Notification* (CRN) system.
 *
 * Provides methods to query notification state, control visibility,
 * and respond to notification events.
 *
 * Extends `EventEmitter`, so `once`, `off` and `removeListener` are also available.
 */
export interface IOverwolfCRNApi extends EventEmitter {
  /**
   * Returns Notification visible status.
   * `true` if the notification is currently visible, `false` if not.
   */
  isNotificationVisible(): Promise<boolean>;

  /**
   * Returns Notification settings status.
   * `true` if notifications are allowed, `false` if not.
   */
  getNotificationStatus(): Promise<boolean>;

  /**
   * Closes the notification.
   */
  closeNotificationWindow(): void;

  /**
   * Enable or disable notifications.
   * @param enable - `true` to enable notifications, `false` to disable.
   * @returns A promise that resolves once the setting has been applied.
   */
  allowNotifications(enable: boolean): Promise<void>;

  /**
   * Fires before a notification is shown. Typically used to abort a notification (e.g., inappropriate timing).
   * @param eventName - `'before-notification'`
   * @param listener - Called synchronously before the notification is shown.
   * Call `event.abort()` inside the listener to prevent the notification from showing.
   * The second `args` parameter is always `undefined`; it is kept only so existing two-parameter listeners still compile.
   */
  on(
    eventName: 'before-notification',
    listener: (event: ICRNEvent, args?: undefined) => void
  ): this;

  /**
   * Fires when a notification action is triggered.
   * @param eventName - `'notification-action'`
   * @param listener - Receives the {@link CRNActionType} describing what happened to the notification.
   */
  on(
    eventName: 'notification-action',
    listener: (action: CRNActionType) => void
  ): this;
}