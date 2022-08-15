// function to check media api availability
import {
	DeviceKind,
	GetMediaDevicesResponse,
	PlatformMediaDeviceInfo,
} from "@/types/MediaTypes"

const isMediaDevicesSupported = (): boolean => {
	return (
		"mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices
	)
}

const convertDevice = (device: MediaDeviceInfo): PlatformMediaDeviceInfo => {
	return {
		deviceId: device.deviceId,
		groupId: device.groupId,
		label: device.label,
		kind: DeviceKind[device.kind],
	}
}

const requestMediaAccess = async (): Promise<boolean | null> => {
	// return null
	// if media devices is not supported - return null
	if (!isMediaDevicesSupported()) return null

	// todo: request all rights

	// else try to get media devices, and if access is granted - return true
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		})

		const tracks = stream.getTracks()

		console.log("tracks", tracks)

		if (tracks.length > 0) {
			tracks.forEach((track) => {
				track.stop()
			})
		}

		return true
	} catch (e) {
		console.log("requestMediaAccess error", e)
		return false
	}
}

const getMediaDevices = async (): Promise<GetMediaDevicesResponse> => {
	const devices = await navigator.mediaDevices.enumerateDevices()

	console.log("devices", devices)

	const audioInputDevices: MediaDeviceInfo[] = devices.filter(
		(device) => device.kind === DeviceKind.audioinput
	)
	const audioOutputDevices: MediaDeviceInfo[] = devices.filter(
		(device) => device.kind === DeviceKind.audiooutput
	)
	const videoInputDevices: MediaDeviceInfo[] = devices.filter(
		(device) => device.kind === DeviceKind.videoinput
	)

	const defaultAI: MediaDeviceInfo | undefined = audioInputDevices.find(
		(s) => s.deviceId === "default"
	)

	const defaultAO: MediaDeviceInfo | undefined = audioOutputDevices.find(
		(s) => s.deviceId === "default"
	)

	const defaultVI: MediaDeviceInfo | undefined = videoInputDevices.find(
		(s) => s.deviceId === "default"
	)

	console.log(devices)

	return {
		audioInputs: audioInputDevices.map((d) => convertDevice(d)),
		audioOutputs: audioOutputDevices.map((d) => convertDevice(d)),
		videoInputs: videoInputDevices.map((d) => convertDevice(d)),
		defaults: {
			audioInput: defaultAI ? convertDevice(defaultAI) : undefined,
			audioOutput: defaultAO ? convertDevice(defaultAO) : undefined,
			videoInput: defaultVI ? convertDevice(defaultVI) : undefined,
		},
	}
}

export {
	isMediaDevicesSupported,
	requestMediaAccess,
	getMediaDevices,
	convertDevice,
}
