import {useCallback, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {usePlatform} from "@/hooks/Platform/PlatformProvider"
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer"
import {Message} from "@/types/ChatTypes"

function TestPage() {
	// props
	const {session_id: sessionId, email} = useParams()
	const {
		platformReady,
		joinCall,
		joinPrivateCall,
		sendMessage,
		getLocalParticipant,
		toggleLocalParticipantVideo,
		toggleLocalParticipantAudio,
		participants,
		privateParticipants,
		muteEveryone,
		toggleMuteEveryone,
		clear,
		timer,
	} = usePlatform()

	// state
	const [micState, setMicState] = useState(true)
	const [camState, setCamState] = useState(true)

	const [privateMicState, setPrivateMicState] = useState(true)
	const [privateCamState, setPrivateCamState] = useState(true)

	// functions
	const joinCallCallback = useCallback(() => {
		sessionId && email && joinCall(sessionId, email)
	}, [email, joinCall, sessionId])

	const joinPrivateCallCallback = useCallback(() => {
		joinPrivateCall("PrivateCalls")
	}, [joinPrivateCall])

	const toggleLocalInput = useCallback(
		(type: "video" | "audio") => {
			switch (type) {
				case "audio":
					setMicState((prevState) => {
						toggleLocalParticipantAudio(!prevState, false)
						return !prevState
					})
					break

				case "video":
					setCamState((prevState) => {
						toggleLocalParticipantVideo(!prevState, false)
						return !prevState
					})
					break
			}
		},
		[toggleLocalParticipantAudio, toggleLocalParticipantVideo]
	)

	const togglePrivateLocalInput = useCallback(
		(type: "video" | "audio") => {
			switch (type) {
				case "audio":
					setPrivateMicState((prevState) => {
						toggleLocalParticipantAudio(!prevState, true)
						return !prevState
					})
					break

				case "video":
					setPrivateCamState((prevState) => {
						toggleLocalParticipantVideo(!prevState, true)
						return !prevState
					})
					break
			}
		},
		[toggleLocalParticipantAudio, toggleLocalParticipantVideo]
	)

	const setTimerCallback = useCallback(
		(state: "start" | "stop") => {
			const msg: Message = {
				id: 0,
				structure: [
					{
						content: state === "start" ? "120" : "0",
						type: "timer",
					},
				],
				meta: {
					userId: "",
					type: "system",
					date: new Date().getTime(),
				},
			}

			sendMessage(msg)
		},
		[sendMessage]
	)

	const leavePrivateCall = useCallback(() => {
		clear(true).then(() => {
			console.log("private call ended")
		})
	}, [clear])

	// effects
	useEffect(() => {
		joinCallCallback()
	}, [joinCallCallback])

	// todo: remove participant from array when leave

	useEffect(() => {
		return () => {
			console.log("clear dead in sessionPage")
			clear().then()
		}
	}, [clear])

	if (!platformReady) return <p>Loading...</p>

	return (
		<div>
			<h1>TestPage view</h1>

			<div>
				<p>Me:</p>

				<div>
					<p>Local actions:</p>

					<button
						type={"button"}
						onClick={() => {
							toggleLocalInput("audio")
						}}
					>
						mic {micState ? "on" : "off"}
					</button>
					<button
						type={"button"}
						onClick={() => {
							toggleLocalInput("video")
						}}
					>
						camera {camState ? "on" : "off"}
					</button>
					<button
						type={"button"}
						onClick={() => {
							toggleMuteEveryone()
						}}
					>
						mute everyone {muteEveryone ? "on" : "off"}
					</button>
				</div>

				<div
					style={{
						position: "relative",
						width: "320px",
						height: "240px",
					}}
				>
					<VideoPlayer
						videoTrack={getLocalParticipant()?.videoTrack}
					/>
				</div>
			</div>

			<div>
				<p>Global actions:</p>

				<button
					type={"button"}
					onClick={() => {
						setTimerCallback("start")
					}}
				>
					timer start
				</button>

				<button
					type={"button"}
					onClick={() => {
						setTimerCallback("stop")
					}}
				>
					timer stop
				</button>

				<p>{JSON.stringify(timer)}</p>
			</div>

			<div>
				<p>Participants:</p>

				{participants &&
					participants.length > 0 &&
					participants
						.filter((s) => s.local !== true)
						.map((participant) => {
							return (
								<div
									key={participant.user_id}
									style={{
										position: "relative",
										width: "240px",
										height: "180px",
									}}
								>
									<VideoPlayer
										videoTrack={participant.videoTrack}
										audioTrack={participant.audioTrack}
									/>
								</div>
							)
						})}
			</div>

			<div>
				<button
					type={"button"}
					onClick={() => {
						// raiseHandAccept(hand)
						joinPrivateCallCallback()
					}}
				>
					join private call
				</button>
			</div>

			<div>
				<p>Private call:</p>

				<button
					type={"button"}
					onClick={() => {
						togglePrivateLocalInput("audio")
					}}
				>
					mic {privateMicState ? "on" : "off"}
				</button>

				<button
					type={"button"}
					onClick={() => {
						leavePrivateCall()
					}}
				>
					leave private call
				</button>

				{privateParticipants &&
					privateParticipants.length > 0 &&
					privateParticipants
						// .filter((s) => s.local !== true)
						.map((participant) => {
							return (
								<div
									key={participant.user_id}
									style={{
										position: "relative",
										width: "240px",
										height: "180px",
									}}
								>
									<VideoPlayer
										videoTrack={participant.videoTrack}
										audioTrack={participant.audioTrack}
									/>
								</div>
							)
						})}
			</div>
		</div>
	)
}

export default TestPage
