type MessageContent = {
	content: string
	type:
		| "image"
		| "text"
		| "voice"
		| "audio"
		| "timer"
		| "raise-hand"
		| "raise-hand-accept"
}

type MessageMeta = {
	userId: string
	type: "system" | "default"
	date: number
}

type Message = {
	id: string | number
	structure: MessageContent[]
	meta: MessageMeta
}

export type {Message, MessageMeta, MessageContent}
