enum DeviceKind {
	audioinput = "audioinput",
	audiooutput = "audiooutput",
	videoinput = "videoinput",
}

type PlatformMediaDeviceInfo = {
	deviceId: string
	groupId: string
	kind: DeviceKind
	label: string
}

type GetMediaDevicesResponse = {
	audioInputs: PlatformMediaDeviceInfo[]
	audioOutputs: PlatformMediaDeviceInfo[]
	videoInputs: PlatformMediaDeviceInfo[]
	defaults: {
		audioInput: PlatformMediaDeviceInfo | undefined
		audioOutput: PlatformMediaDeviceInfo | undefined
		videoInput: PlatformMediaDeviceInfo | undefined
	}
}

export {DeviceKind}
export type {GetMediaDevicesResponse, PlatformMediaDeviceInfo}
