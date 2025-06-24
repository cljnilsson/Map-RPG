export type CharSprite = {
	name: string;
	image: string;
};

// Shared properties
type BaseMessage = {
	from: CharSprite;
	onChoice?: () => void;
};

// Text message
export type TextMessage = BaseMessage & {
	type: "text";
	text: string;
	next: number;
};

// Choice option
export type ChoiceOption = {
	text: string;
	next: number;
	saveResponse: boolean;
	onChoice?: () => void;
};

// Choice message
export type ChoiceMessage = BaseMessage & {
	type: "choice";
	choices: ChoiceOption[];
};

// Union type for any message
export type Message = TextMessage | ChoiceMessage;

// Slimmed down version for non-dialogue use
export type IsolatedMessage =
	| Omit<TextMessage, "next" | "onChoice">
	| (Omit<ChoiceMessage, "choices" | "onChoice"> & {
			choices: Array<Omit<ChoiceOption, "saveResponse" | "onChoice" | "next">>;
	  });
