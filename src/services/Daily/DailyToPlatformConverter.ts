import {DailyParticipant} from "@daily-co/daily-js"
import {PlatformParticipant} from "@/types/PlatformTypes"

class DailyToPlatformConverter {
	public static convertParticipant(
		participant: DailyParticipant
	): PlatformParticipant {
		console.log("DailyToPlatformConverter", participant)
		return {
			user_id: participant.user_id,
			session_id: participant.session_id,
			username: participant.user_name,
			tracks: participant.tracks,
			local: participant.local,
			videoTrack: participant.videoTrack,
			audioTrack: participant.audioTrack,
		}
	}
}

export {DailyToPlatformConverter}
