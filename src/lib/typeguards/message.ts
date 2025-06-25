import type { IsolatedMessage, TextMessage, ChoiceMessage, Message } from "$lib/types/message";

function isMessageText(msg: Message | IsolatedMessage): msg is TextMessage {
	return "type" in msg && msg.type === "text";
}

function isMessageChoice(msg: Message | IsolatedMessage): msg is ChoiceMessage {
	return "type" in msg && msg.type === "choice";
}

export { isMessageChoice, isMessageText };