import DailyIframe, {DailyEventObject} from "@daily-co/daily-js"
import {PlatformInitialConfig, PrivatePlatform} from "@/types/PlatformTypes"
import {DailyCommonPlatform} from "@/services/Daily/DailyCommonPlatform"
import {DailyToPlatformConverter} from "@/services/Daily/DailyToPlatformConverter"
import {
	privateParticipantJoined,
	privateParticipantUpdated,
	resetPrivatePlatformState,
} from "@/store/slices/PlatformPrivateSlice"

class DailyPrivatePlatform
	extends DailyCommonPlatform
	implements PrivatePlatform
{
	public init(config: PlatformInitialConfig) {
		console.log("daily init")
		this.dispatch = config.dispatch
		this.callObject = DailyIframe.createCallObject()
		this.subscribeDailyEvents()
	}

	private subscribeDailyEvents() {
		if (!this.callObject || !this.dispatch) return

		this.callObject.on("joined-meeting", (event) => {
			this.onLocalParticipantJoinedHandler(event)
		})

		this.callObject.on("participant-joined", (event) => {
			this.onParticipantJoinedHandler(event)
		})

		this.callObject.on("participant-updated", (event) => {
			this.onParticipantUpdatedHandler(event)
		})

		this.callObject.on("participant-left", (event) => {
			this.onParticipantLeftHandler(event)
		})
	}

	private onLocalParticipantJoinedHandler(event: DailyEventObject) {
		this.onParticipantJoinedHandler(event, true)
	}

	private onParticipantJoinedHandler(event: DailyEventObject, local = false) {
		if (!this.dispatch) return

		const participant = local ? event.participants.local : event.participant

		this.dispatch(
			privateParticipantJoined({
				participant:
					DailyToPlatformConverter.convertParticipant(participant),
			})
		)
	}

	private onParticipantUpdatedHandler(event: DailyEventObject) {
		if (!this.dispatch) return

		const participant = event.participant

		this.dispatch(
			privateParticipantUpdated({
				participant:
					DailyToPlatformConverter.convertParticipant(participant),
				left: false,
			})
		)
	}

	private onParticipantLeftHandler(event: DailyEventObject) {
		if (!this.dispatch) return

		const participant = event.participant

		console.log("onParticipantLeftHandler", event)

		this.dispatch(
			privateParticipantUpdated({
				participant:
					DailyToPlatformConverter.convertParticipant(participant),
				left: true,
			})
		)
	}

	public clear() {
		if (!this.callObject || !this.dispatch) return

		console.log("clear fn") //

		const dispatch = this.dispatch

		this.callObject.leave().then(() => {
			// clear participants list and messages
			dispatch(resetPrivatePlatformState())

			// this.callObject?.destroy()
		})
	}
}

export {DailyPrivatePlatform}
