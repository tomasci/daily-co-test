import {AppDispatch} from "@/store/store"
import {Message} from "@/types/ChatTypes"
import {PlatformMediaDeviceInfo} from "@/types/MediaTypes"

enum PlatformType {
	daily = "daily",
}

type PlatformParticipant = {
	user_id: string
	session_id: string
	username: string
	tracks: {
		audio: any
		video: any
		screenAudio: any
		screenVideo: any
	}
	local: boolean
	videoTrack: MediaStreamTrack | undefined
	audioTrack: MediaStreamTrack | undefined
}

export type PlatformInitialConfig = {
	dispatch: AppDispatch
}

interface CommonPlatform {
	init?: (config: PlatformInitialConfig) => void
	joinCall: (url: string, token?: string, username?: string) => void
	toggleInputOutput: (device: PlatformMediaDeviceInfo) => Promise<boolean>
	toggleParticipantAudio: (
		participant: PlatformParticipant,
		state: boolean
	) => void
	toggleLocalParticipantAudio: (state: boolean) => void
	toggleLocalParticipantVideo: (state: boolean) => void
	clear?: () => void
}

type Platform = {
	sendMessage: (message: Message, to?: string) => void
} & CommonPlatform

type PrivatePlatform = CommonPlatform

export {PlatformType}
export type {CommonPlatform, Platform, PrivatePlatform, PlatformParticipant}
