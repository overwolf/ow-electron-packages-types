

// -----------------------------------------------------------------------------
/**
 * @owpackage Packages
 */
interface OWPackages extends overwolf.packages.OverwolfPackageManager {
  recorder: IOverwolfRecordingApi;
  overlay: IOverwolfOverlayApi;
  utility: IOverwolfUtilityApi;
  crn: IOverwolfCRNApi;
}