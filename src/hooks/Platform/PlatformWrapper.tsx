import {ReactNode} from "@/utils/CommonTypes"
import {Platform, PrivatePlatform} from "@/types/PlatformTypes"
import {useEffect, useState} from "react"
import PlatformProvider from "@/hooks/Platform/PlatformProvider"
import {useAppDispatch} from "@/store/store"
import {getPrivateProvider, getProvider} from "@/services/Platform/Platform"

interface PlatformWrapperProps {
	children: ReactNode
}

// todo: rtk -> fetch

function PlatformWrapper(props: PlatformWrapperProps) {
	// props
	const {children} = props
	const dispatch = useAppDispatch()

	// state
	const [provider, setProvider] = useState<Platform | null>(null)
	const [privateProvider, setPrivateProvider] =
		useState<PrivatePlatform | null>(null)

	// effects
	useEffect(() => {
		// general provider
		const provider = getProvider()
		provider.init &&
			provider.init({
				dispatch: dispatch,
			})

		// private provider
		const pProvider = getPrivateProvider()
		pProvider.init &&
			pProvider.init({
				dispatch: dispatch,
			})

		setProvider(provider)
		setPrivateProvider(pProvider)

		return () => {
			console.log("clear dead in platformWrapper")
			provider.clear && provider.clear()
			pProvider.clear && pProvider.clear()
		}
	}, [dispatch])

	if (!provider || !privateProvider)
		return <p>Something wrong with provider initialization</p>

	return (
		<PlatformProvider provider={provider} privateProvider={privateProvider}>
			{children}
		</PlatformProvider>
	)
}

export default PlatformWrapper
