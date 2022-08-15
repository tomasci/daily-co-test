import DailyIframe, {
	DailyEventObject,
	DailyEventObjectAppMessage,
} from "@daily-co/daily-js"
import {Platform, PlatformInitialConfig} from "@/types/PlatformTypes"
import {
	addRaisedHand,
	endTimer,
	newChatMessage,
	participantJoined,
	participantUpdated,
	resetPlatformState,
	startTimer,
} from "@/store/slices/PlatformSlice"
import {Message} from "@/types/ChatTypes"
import {DailyCommonPlatform} from "@/services/Daily/DailyCommonPlatform"
import {DailyToPlatformConverter} from "@/services/Daily/DailyToPlatformConverter"

class DailyPlatform extends DailyCommonPlatform implements Platform {
	public init(config: PlatformInitialConfig) {
		console.log("daily init")
		this.dispatch = config.dispatch
		this.callObject = DailyIframe.createCallObject({
			// dailyConfig: {
			// 	micAudioMode: "music",
			// 	fastConnect: true,
			// },
		})
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

		this.callObject.on("app-message", (event) => {
			this.onChatMessage(event)
		})
	}

	private onLocalParticipantJoinedHandler(event: DailyEventObject) {
		this.onParticipantJoinedHandler(event, true)
	}

	private onParticipantJoinedHandler(event: DailyEventObject, local = false) {
		if (!this.dispatch) return

		const participant = local ? event.participants.local : event.participant

		this.dispatch(
			participantJoined({
				participant:
					DailyToPlatformConverter.convertParticipant(participant),
			})
		)
	}

	private onParticipantUpdatedHandler(event: DailyEventObject) {
		if (!this.dispatch) return

		const participant = event.participant

		this.dispatch(
			participantUpdated({
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
			participantUpdated({
				participant:
					DailyToPlatformConverter.convertParticipant(participant),
				left: true,
			})
		)
	}

	private onChatMessage(event: DailyEventObjectAppMessage | undefined) {
		if (!event || !this.dispatch) return
		console.log("app-message incoming", event)

		const message: Message = event.data
		this.messageProcessing(message, event.fromId)
	}

	private messageProcessing(message: Message, from: string | null) {
		if (!this.dispatch) return

		switch (message.meta.type) {
			case "system":
				console.log("sys message")
				this.messagesFromSystem(message, from)
				break

			case "default":
				console.log("default message")
				this.dispatch(
					newChatMessage({
						message: message,
					})
				)
				break

			default:
				console.log("other message")
				break
		}
	}

	private messagesFromSystem(message: Message, from: string | null) {
		if (!this.dispatch) return
		const dispatch = this.dispatch

		message.structure.forEach((part) => {
			switch (part.type) {
				case "timer":
					dispatch(
						startTimer({
							timerEnd: Number(part.content),
						})
					)
					break

				case "raise-hand":
					if (!from) return
					dispatch(
						addRaisedHand({
							from: from,
						})
					)
					break

				case "raise-hand-accept":
					console.log("accept call from", part.content)
					break
			}
		})
	}

	public sendMessage(message: Message, to = "*") {
		if (!this.callObject) return

		console.log("app-message sent", message, JSON.stringify(message))

		this.messageProcessing(message, null) // todo: maybe need to replace with another func

		// todo: before sending the message also process it (for example for timer and messages we also need to update the state locally)

		// this.callObject.sendAppMessage(JSON.stringify(message), "*")
		this.callObject.sendAppMessage(message, to)
		// this.callObject.sendAppMessage(
		// 	{action: "CHAT_MESSAGE", message: "test", username: "test"},
		// 	"*"
		// )
	}

	public clear() {
		if (!this.callObject || !this.dispatch) return

		console.log("clear fn") //

		const dispatch = this.dispatch

		this.callObject.leave().then(() => {
			// clear participants list and messages
			dispatch(resetPlatformState())
			// reset timer
			dispatch(endTimer())

			// this.callObject?.destroy()
		})

		// this.callObject.off("joined-meeting")

		// todo: unsubscribe from events here
	}
}

export {DailyPlatform}
