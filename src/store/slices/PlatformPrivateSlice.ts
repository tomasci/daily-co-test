import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {PlatformParticipant} from "@/types/PlatformTypes"
import {DailyCall} from "@daily-co/daily-js"

type InitialState = {
	privateCallObject: DailyCall | null
	privateParticipants: PlatformParticipant[]
}

const initialState: InitialState = {
	privateCallObject: null,
	privateParticipants: [],
}

const PlatformPrivateSlice = createSlice({
	name: "PlatformPrivateSlice",
	initialState,
	reducers: {
		privateParticipantJoined: (
			state,
			action: PayloadAction<{participant: PlatformParticipant}>
		) => {
			const participants = state.privateParticipants

			const search = participants.find(
				(s) => s.session_id === action.payload.participant.session_id
			)

			if (!search) {
				participants.push(action.payload.participant)
			}

			state.privateParticipants = participants
		},
		privateParticipantUpdated: (
			state,
			action: PayloadAction<{
				participant: PlatformParticipant
				left: boolean
			}>
		) => {
			const participants = state.privateParticipants
			const search = participants.find(
				(s) => s.session_id === action.payload.participant.session_id
			)
			if (search) {
				const index = participants.indexOf(search)
				participants.splice(index, 1)

				if (!action.payload.left) {
					participants.push(action.payload.participant)
				}

				state.privateParticipants = participants
			}
		},
		resetPrivatePlatformState: (state) => {
			state.privateParticipants = []
		},
	},
})

export const {
	privateParticipantJoined,
	privateParticipantUpdated,
	resetPrivatePlatformState,
} = PlatformPrivateSlice.actions
export default PlatformPrivateSlice.reducer
