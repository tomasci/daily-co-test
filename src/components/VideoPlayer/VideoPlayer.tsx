import {useEffect, useRef} from "react"

interface VideoPlayerProps {
	videoTrack?: MediaStreamTrack | undefined
	audioTrack?: MediaStreamTrack | undefined
	audioMuted?: boolean
}

function VideoPlayer(props: VideoPlayerProps) {
	const {audioTrack, videoTrack, audioMuted} = props

	const videoElementRef = useRef<HTMLVideoElement>(null)
	const audioElementRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		if (!videoElementRef || !videoElementRef.current) return

		if (videoTrack) {
			videoElementRef.current.srcObject = new MediaStream([videoTrack])
		}
	}, [videoTrack])

	useEffect(() => {
		if (!audioElementRef || !audioElementRef.current) return

		if (audioTrack) {
			audioElementRef.current.srcObject = new MediaStream([audioTrack])
		}
	}, [audioTrack])

	return (
		<div style={{width: "100%", height: "100%"}}>
			<audio
				autoPlay
				muted={audioMuted ? true : false}
				playsInline
				ref={audioElementRef}
			/>

			<video
				autoPlay
				muted
				playsInline
				ref={videoElementRef}
				style={{width: "100%", height: "100%"}}
			/>
		</div>
	)
}

export default VideoPlayer
