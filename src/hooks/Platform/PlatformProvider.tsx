import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react"
import {ReactNode} from "@/utils/CommonTypes"
import {
	getMediaDevices,
	isMediaDevicesSupported,
	requestMediaAccess,
} from "@/services/Media/Media"
import {DeviceKind, PlatformMediaDeviceInfo} from "@/types/MediaTypes"
import {
	PlatformParticipant,
	Platform,
	PrivatePlatform,
} from "@/types/PlatformTypes"
import {useAppDispatch, useAppSelector} from "@/store/store"
import {
	setCurrentAudioInput,
	setCurrentAudioOutput,
	setCurrentVideoInput,
	toggleMuteEveryone,
} from "@/store/slices/PlatformSlice"
import {Message} from "@/types/ChatTypes"

interface PlatformProviderProps {
	children: ReactNode
	provider: Platform
	privateProvider: PrivatePlatform
	// platform: PlatformType
}

interface PlatformContextProps {
	// state
	mediaDevicesSupport: boolean | null
	mediaAccessGranted: boolean | null
	platformReady: boolean
	audioInputs: PlatformMediaDeviceInfo[]
	audioOutputs: PlatformMediaDeviceInfo[]
	videoInputs: PlatformMediaDeviceInfo[]
	currentAudioInput: PlatformMediaDeviceInfo | null
	currentAudioOutput: PlatformMediaDeviceInfo | null
	currentVideoInput: PlatformMediaDeviceInfo | null
	participants: PlatformParticipant[]
	privateParticipants: PlatformParticipant[]
	timer: {
		active: boolean
		until: number | null
	}
	muteEveryone: boolean
	raisedHands: string[]
	// functions
	toggleInputOutput: (
		device: PlatformMediaDeviceInfo,
		isPrivate?: boolean
	) => void
	joinCall: (sessionId: string, username: string) => void
	joinPrivateCall: (room: string) => void
	sendMessage: (message: Message) => void
	toggleParticipantAudio: (
		participant: PlatformParticipant,
		state: boolean,
		isPrivate?: boolean
	) => void
	getLocalParticipant: () => PlatformParticipant | null
	toggleLocalParticipantAudio: (state: boolean, isPrivate?: boolean) => void
	toggleLocalParticipantVideo: (state: boolean, isPrivate?: boolean) => void
	toggleMuteEveryone: () => void
	raiseHand: () => void
	raiseHandAccept: (to: string) => void
	clear: (isPrivate?: boolean) => Promise<boolean>
}

const PlatformContext = createContext<PlatformContextProps>({
	mediaDevicesSupport: null,
	mediaAccessGranted: null,
	platformReady: false,
	audioInputs: [],
	audioOutputs: [],
	videoInputs: [],
	currentAudioInput: null,
	currentAudioOutput: null,
	currentVideoInput: null,
	participants: [],
	privateParticipants: [],
	timer: {
		active: false,
		until: null,
	},
	muteEveryone: false,
	raisedHands: [],
	toggleInputOutput: () => null,
	joinCall: () => null,
	joinPrivateCall: () => null,
	sendMessage: () => null,
	toggleParticipantAudio: () => null,
	getLocalParticipant: () => null,
	toggleLocalParticipantAudio: () => null,
	toggleLocalParticipantVideo: () => null,
	toggleMuteEveryone: () => null,
	raiseHand: () => null,
	raiseHandAccept: () => null,
	clear: () => new Promise((resolve) => resolve),
})

function PlatformProvider(props: PlatformProviderProps) {
	// props
	const {children, provider, privateProvider} = props
	const dispatch = useAppDispatch()

	// state
	const [mediaDevicesSupport, setMediaDevicesSupport] = useState<
		boolean | null
	>(null)
	const [mediaAccessGranted, setMediaAccessGranted] = useState<
		boolean | null
	>(null)
	const [platformReady, setPlatformReady] = useState<boolean>(false)
	const [audioInputs, setAudioInputs] = useState<PlatformMediaDeviceInfo[]>(
		[]
	)
	const [audioOutputs, setAudioOutputs] = useState<PlatformMediaDeviceInfo[]>(
		[]
	)
	const [videoInputs, setVideoInputs] = useState<PlatformMediaDeviceInfo[]>(
		[]
	)

	const {
		participants,
		currentAudioInput,
		currentAudioOutput,
		currentVideoInput,
		timerActive,
		timerUntil,
		muteEveryone: muteEveryoneState,
		raisedHands: raisedHandsState,
	} = useAppSelector((state) => state.PlatformSlice)

	const {privateParticipants} = useAppSelector(
		(state) => state.PlatformPrivateSlice
	)

	// functions
	// check api support
	const isMediaDevicesSupportedCallback = useCallback(() => {
		return isMediaDevicesSupported()
	}, [])

	// request media access
	const requestMediaAccessCallback = useCallback(() => {
		return requestMediaAccess()
	}, [])

	// get media devices
	const getMediaDevicesCallback = useCallback(() => {
		return getMediaDevices()
	}, [])

	// switch devices
	const toggleInputOutputCallback = useCallback(
		(device: PlatformMediaDeviceInfo, isPrivate = false) => {
			const currentProvider = isPrivate ? privateProvider : provider

			currentProvider.toggleInputOutput(device).then((r) => {
				if (r) {
					switch (device.kind) {
						case DeviceKind.audioinput:
							dispatch(
								setCurrentAudioInput({
									device: device,
								})
							)
							break

						case DeviceKind.audiooutput:
							dispatch(
								setCurrentAudioOutput({
									device: device,
								})
							)
							break

						case DeviceKind.videoinput:
							dispatch(
								setCurrentVideoInput({
									device: device,
								})
							)
							break
					}
				}
			})
		},
		[provider, privateProvider]
	)

	// mute/unmute remote client (for everyone)
	const toggleParticipantAudioCallback = useCallback(
		(
			participant: PlatformParticipant,
			state: boolean,
			isPrivate = false
		) => {
			const currentProvider = isPrivate ? privateProvider : provider
			currentProvider.toggleParticipantAudio(participant, state)
		},
		[provider, privateProvider]
	)

	const joinCall = useCallback(
		async (sessionId: string, username: string) => {
			try {
				const url = "https://agado.daily.co/" + sessionId
				const token =
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvIjp0cnVlLCJkIjoiMDc5Njc0Y2MtMDkwMy00ZWQzLWIwZmQtOWM4ODk2ZjRjNmQ4IiwiaWF0IjoxNjM5NzI3ODc0fQ.vZcYYk68FD8ixA5gEsy1Rzv8N4i-97j09W_tvfy2Egg"

				provider.joinCall(url)
			} catch (e) {
				console.log("joinCall error", e)
			}
		},
		[provider]
	)

	const joinPrivateCall = useCallback(
		async (room: string) => {
			try {
				const url = "https://agado.daily.co/" + room
				const token =
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvIjp0cnVlLCJkIjoiMDc5Njc0Y2MtMDkwMy00ZWQzLWIwZmQtOWM4ODk2ZjRjNmQ4IiwiaWF0IjoxNjM5NzI3ODc0fQ.vZcYYk68FD8ixA5gEsy1Rzv8N4i-97j09W_tvfy2Egg"

				privateProvider.joinCall(url, token)
			} catch (e) {
				console.log("joinPrivateCall error", e)
			}
		},
		[privateProvider]
	)

	const clearCallback = useCallback(
		(isPrivate = false): Promise<boolean> => {
			return new Promise((resolve) => {
				const currentProvider = isPrivate ? privateProvider : provider

				currentProvider.clear && currentProvider.clear()
				resolve(true)
			})
		},
		[provider, privateProvider]
	)

	// send message
	const sendMessageCallback = useCallback(
		(message: Message) => {
			provider.sendMessage(message)
		},
		[provider]
	)

	const getLocalParticipant = useCallback(() => {
		if (!participants || participants.length < 1) return null

		const localParticipant = participants.find((s) => s.local === true)
		if (localParticipant) return localParticipant
		return null
	}, [participants])

	const toggleLocalParticipantAudioCallback = useCallback(
		(state: boolean, isPrivate = false) => {
			const currentProvider = isPrivate ? privateProvider : provider

			console.log(
				"toggleLocalParticipantAudioCallback",
				isPrivate,
				currentProvider,
				typeof currentProvider
			)

			currentProvider.toggleLocalParticipantAudio(state)
		},
		[provider, privateProvider]
	)

	const toggleLocalParticipantVideoCallback = useCallback(
		(state: boolean, isPrivate = false) => {
			const currentProvider = isPrivate ? privateProvider : provider

			console.log(
				"toggleLocalParticipantAudioCallback",
				isPrivate,
				currentProvider,
				typeof currentProvider
			)

			currentProvider.toggleLocalParticipantVideo(state)
		},
		[provider, privateProvider]
	)

	const toggleMuteEveryoneCallback = useCallback(() => {
		console.log("muteEveryone")
		dispatch(toggleMuteEveryone())
	}, [dispatch])

	const raiseHandCallback = useCallback(() => {
		const msg: Message = {
			id: 0,
			structure: [
				{
					content: "raise-hand",
					type: "raise-hand",
				},
			],
			meta: {
				userId: "",
				type: "system",
				date: new Date().getTime(),
			},
		}

		// sendMessageCallback(msg)
		provider.sendMessage(msg)
	}, [provider])

	const raiseHandAcceptCallback = useCallback(
		(to: string) => {
			const msg: Message = {
				id: 0,
				structure: [
					{
						content: `private-room-${to}`,
						type: "raise-hand-accept",
					},
				],
				meta: {
					userId: "",
					type: "system",
					date: new Date().getTime(),
				},
			}

			// sendMessageCallback(msg)
			provider.sendMessage(msg, to)
		},
		[provider]
	)

	// effects
	// useEffect(() => {
	// 	provider.init({
	// 		dispatch: dispatch,
	// 	})
	// }, [provider])

	// run support check
	useEffect(() => {
		const supported = isMediaDevicesSupportedCallback()
		setMediaDevicesSupport(supported)
	}, [isMediaDevicesSupportedCallback])

	// run access check
	useEffect(() => {
		if (!mediaDevicesSupport) return
		requestMediaAccessCallback().then((r) => {
			setMediaAccessGranted(r)
		})
	}, [mediaDevicesSupport, requestMediaAccessCallback])

	// run get devices
	useEffect(() => {
		if (!mediaDevicesSupport || !mediaAccessGranted) return

		getMediaDevicesCallback().then((r) => {
			setAudioInputs(r.audioInputs)
			setAudioOutputs(r.audioOutputs)
			setVideoInputs(r.videoInputs)

			r.defaults.audioInput &&
				dispatch(
					setCurrentAudioInput({
						device: r.defaults.audioInput,
					})
				)
			r.defaults.audioOutput &&
				dispatch(
					setCurrentAudioOutput({
						device: r.defaults.audioOutput,
					})
				)
			r.defaults.videoInput &&
				dispatch(
					setCurrentVideoInput({
						device: r.defaults.videoInput,
					})
				)
		})
	}, [mediaDevicesSupport, mediaAccessGranted, getMediaDevicesCallback])

	// define platform state
	useEffect(() => {
		if (
			typeof mediaDevicesSupport === "boolean" &&
			typeof mediaAccessGranted === "boolean"
		) {
			setPlatformReady(true)
		}
	}, [mediaDevicesSupport, mediaAccessGranted])

	// component
	return (
		<PlatformContext.Provider
			value={{
				// state
				mediaDevicesSupport,
				mediaAccessGranted,
				platformReady,
				audioInputs,
				audioOutputs,
				videoInputs,
				currentAudioInput,
				currentAudioOutput,
				currentVideoInput,
				participants,
				privateParticipants,
				timer: {
					active: timerActive,
					until: timerUntil,
				},
				muteEveryone: muteEveryoneState,
				raisedHands: raisedHandsState,
				// functions
				toggleInputOutput: toggleInputOutputCallback,
				joinCall,
				joinPrivateCall,
				sendMessage: sendMessageCallback,
				toggleParticipantAudio: toggleParticipantAudioCallback,
				getLocalParticipant: getLocalParticipant,
				toggleLocalParticipantAudio:
					toggleLocalParticipantAudioCallback,
				toggleLocalParticipantVideo:
					toggleLocalParticipantVideoCallback,
				toggleMuteEveryone: toggleMuteEveryoneCallback,
				raiseHand: raiseHandCallback,
				raiseHandAccept: raiseHandAcceptCallback,
				clear: clearCallback,
			}}
		>
			{children}
		</PlatformContext.Provider>
	)
}

export default PlatformProvider
export const usePlatform = () => useContext(PlatformContext)
