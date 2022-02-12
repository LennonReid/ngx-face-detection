/**
 * get the supported camera
 */
export async function getAvailableVideoInputs(): Promise<MediaDeviceInfo[]> {
  if (!(!navigator.mediaDevices.enumerateDevices && !navigator.mediaDevices)) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput');
    } catch (error) {
      console.log(error);
    }
  }
  return [];
}
