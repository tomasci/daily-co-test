import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {PlatformParticipant} from "@/types/PlatformTypes"
import {DailyCall} from "@daily-co/daily-js"
import {Message} from "@/types/ChatTypes"
import {PlatformMediaDeviceInfo} from "@/types/MediaTypes"

type InitialState = {
	callObject: DailyCall | null
	currentAudioInput: PlatformMediaDeviceInfo | null
	currentAudioOutput: PlatformMediaDeviceInfo | null
	currentVideoInput: PlatformMediaDeviceInfo | null
	participants: PlatformParticipant[]
	messages: Message[]
	timerActive: boolean
	timerUntil: number | null
	muteEveryone: boolean
	raisedHands: string[]
}

type Device = {device: PlatformMediaDeviceInfo}

const initialState: InitialState = {
	callObject: null,
	currentAudioInput: null,
	currentAudioOutput: null,
	currentVideoInput: null,
	participants: [],
	messages: [],
	timerActive: false,
	timerUntil: null,
	muteEveryone: false,
	raisedHands: [],
}

const PlatformSlice = createSlice({
	name: "PlatformSlice",
	initialState,
	reducers: {
		setCurrentAudioInput: (state, action: PayloadAction<Device>) => {
			state.currentAudioInput = action.payload.device
		},
		setCurrentAudioOutput: (state, action: PayloadAction<Device>) => {
			state.currentAudioOutput = action.payload.device
		},
		setCurrentVideoInput: (state, action: PayloadAction<Device>) => {
			state.currentVideoInput = action.payload.device
		},
		participantJoined: (
			state,
			action: PayloadAction<{participant: PlatformParticipant}>
		) => {
			const participants = state.participants

			const search = participants.find(
				(s) => s.session_id === action.payload.participant.session_id
			)

			if (!search) {
				participants.push(action.payload.participant)
			}

			state.participants = participants
		},
		participantUpdated: (
			state,
			action: PayloadAction<{
				participant: PlatformParticipant
				left: boolean
			}>
		) => {
			const participants = state.participants
			const search = participants.find(
				(s) => s.session_id === action.payload.participant.session_id
			)
			if (search) {
				const index = participants.indexOf(search)
				participants.splice(index, 1)

				if (!action.payload.left) {
					participants.push(action.payload.participant)
				}

				state.participants = participants
			}
		},
		newChatMessage: (state, action: PayloadAction<{message: Message}>) => {
			const messages = state.messages

			messages.push(action.payload.message)

			state.messages = messages
		},
		startTimer: (state, action: PayloadAction<{timerEnd: number}>) => {
			if (action.payload.timerEnd === 0) {
				// if current time > timer end, it is call to stop timer
				state.timerActive = false
				state.timerUntil = null
			} else {
				state.timerActive = true
				state.timerUntil = action.payload.timerEnd
			}
		},
		endTimer: (state) => {
			state.timerActive = false
			state.timerUntil = null
		},
		toggleMuteEveryone: (state) => {
			state.muteEveryone = !state.muteEveryone
		},
		addRaisedHand: (state, action: PayloadAction<{from: string}>) => {
			const raisedHand = state.raisedHands
			const search = raisedHand.find((s) => s === action.payload.from)
			if (!search) {
				raisedHand.push(action.payload.from)
			}
			state.raisedHands = raisedHand
		},
		resetPlatformState: (state) => {
			state.participants = []
			state.messages = []
			state.muteEveryone = false
			state.timerActive = false
			state.timerUntil = null
			state.raisedHands = []
		},
	},
})

export const {
	setCurrentAudioInput,
	setCurrentAudioOutput,
	setCurrentVideoInput,
	participantJoined,
	participantUpdated,
	newChatMessage,
	startTimer,
	endTimer,
	toggleMuteEveryone,
	addRaisedHand,
	resetPlatformState,
} = PlatformSlice.actions
export default PlatformSlice.reducer
