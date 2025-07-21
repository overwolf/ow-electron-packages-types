

// -----------------------------------------------------------------------------

/**
 * Overwolf CRN API
 * @owpackage CRN
*/
export interface ICRNEvent {
  abort: () => void;
}



/**
 * All supported notification actions.
 * @owpackage CRN
 */
export type CRNActionType =
  /**
   * User clicked on the `X` button to dismiss the notification.
   */
  | 'Dismissed'
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
 * @owpackage CRN
 */
export interface IOverwolfCRNApi {
  /**
   * returns Notification visible status.
   * true if the notification is currently visible, false if not.
   */
  isNotificationVisible(): Promise<boolean>;

  /**
   * returns Notification settings status:
   * true if notifications are allowed, false if not.
   */
  getNotificationStatus(): Promise<boolean>;

  /**
   * Closes the notification.
   */
  closeNotificationWindow(): void;

  /**
   * Enables or disables notifications.
   * @param enable - true to enable notifications, false to disable.
   */
  allowNotifications(enable: boolean): void;

  /**
   * Fired before a notification is shown.
   * @param eventName
   * @param listener
   */
  on(
    eventName: 'before-notification',
    listener: (event: ICRNEvent, args: any) => void
  ): this;

  /**
   * Fired when a notification action is triggered.
   * @param eventName
   * @param listener
   */
  on(
    eventName: 'notification-action',
    listener: (event: CRNActionType) => void
  ): this;
}