/**
 * The *Content Recommendation Notification* (CRN) APIs give you tools to help manage the content notification settings in your app. 
 * 
 * CRN recommends new apps for players that could offer them value.
 * 
 * @packageDocumentation
 */
// -----------------------------------------------------------------------------

/**
 * Used to create cancellable or abortable event.
 *
 * @example
 * ```ts
 * const event: ICRNEvent = createCancelableEvent();
 *
 * // Later in the flow
 * if (shouldCancel) {
 *   event.abort();
 * }
 * ```
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
 * @example
 * ```ts
 * function handleAction(action: CRNActionType) {
 *   if (action === 'OpenExternalUrl') {
 *     // Open a browser tab
 *   }
 * }
 * ```
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
 * Interface for interacting with the Overwolf *Content Recommendation Notification* (CRN) system.
 *
 * Provides methods to query notification state, control visibility,
 * and respond to notification events.
 */
export interface IOverwolfCRNApi {
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
   */
  allowNotifications(enable: boolean): void;

  /**
   * Fired before a notification is shown. Typically used to abort a notification (e.g., inappropriate timing).
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