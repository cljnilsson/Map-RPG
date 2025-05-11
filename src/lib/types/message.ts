export type CharSprite = {
	name: string;
	image: string;
};

export type TextMessage = {
	type: "text";
	text: string;
	from: CharSprite;
	next: number; // index of the next message
};

export type ChoiceOption = {
	text: string;
	next: number;
	saveResponse: boolean;
	onChoice?: () => void; // optional callback when this choice is selected
};

export type ChoiceMessage = {
	type: "choice";
	choices: ChoiceOption[];
	from: CharSprite;
};

export type Message = TextMessage | ChoiceMessage;
