type CharSprite = {
    name: string;
    image: string;
};

type TextMessage = {
    type: 'text';
    text: string;
    from: CharSprite;
};

type ChoiceMessage = {
    type: 'choice';
    choices: string[];
    from: CharSprite;
};

type Message = TextMessage | ChoiceMessage;

export type { Message, TextMessage, ChoiceMessage, CharSprite };