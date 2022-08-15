import DailyIframe, {DailyCall} from "@daily-co/daily-js"
import {DeviceKind, PlatformMediaDeviceInfo} from "@/types/MediaTypes"
import {
	CommonPlatform,
	PlatformInitialConfig,
	PlatformParticipant,
} from "@/types/PlatformTypes"
import {AppDispatch} from "@/store/store"
import {endTimer, resetPlatformState} from "@/store/slices/PlatformSlice"

class DailyCommonPlatform implements CommonPlatform {
	protected callObject: DailyCall | null = null
	protected dispatch: AppDispatch | null = null

	public joinCall(url: string, token?: string, username?: string) {
		if (!this.callObject) return

		console.log("onParticipantJoinedHandler joinCall")

		this.callObject
			.join({
				url: url,
				...(token && {token: token}),
				...(username && {userName: username}),
			})
			.then((r) => {
				//
			})
	}

	public async toggleInputOutput(
		device: PlatformMediaDeviceInfo
	): Promise<boolean> {
		if (!this.callObject) return false

		let result = null

		switch (device.kind) {
			case DeviceKind.audioinput:
				result = await this.callObject.setInputDevicesAsync({
					audioDeviceId: device.deviceId,
				})
				break

			case DeviceKind.audiooutput:
				result = await this.callObject.setOutputDeviceAsync({
					outputDeviceId: device.deviceId,
				})
				break

			case DeviceKind.videoinput:
				result = await this.callObject.setInputDevicesAsync({
					videoDeviceId: device.deviceId,
				})
				break
		}

		return result !== null
	}

	public toggleParticipantAudio(
		participant: PlatformParticipant,
		state: boolean
	) {
		if (!this.callObject) return null

		this.callObject.updateParticipant(participant.session_id, {
			setAudio: state,
		})
	}

	public toggleLocalParticipantAudio(state: boolean) {
		if (!this.callObject) return null
		console.log("toggle", this.callObject)
		this.callObject.setLocalAudio(state)
	}

	public toggleLocalParticipantVideo(state: boolean) {
		if (!this.callObject) return null
		console.log("toggle", this.callObject)
		this.callObject.setLocalVideo(state)
	}
}
export {DailyCommonPlatform}
