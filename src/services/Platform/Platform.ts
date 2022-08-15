import {Platform, PrivatePlatform} from "@/types/PlatformTypes"
import {DailyPlatform} from "@/services/Daily/DailyPlatform"
import {DailyPrivatePlatform} from "@/services/Daily/DailyPrivatePlatform"

const getProvider = (): Platform => {
	return new DailyPlatform()
}

const getPrivateProvider = (): PrivatePlatform => {
	return new DailyPrivatePlatform()
}

export {getProvider, getPrivateProvider}
