import { Events, PartialTextBasedChannelFields, Message } from "discord.js";

interface IHash {
  [key: string]: string;
}

function isPartialTextBasedChannelFields(
  item: object,
): item is PartialTextBasedChannelFields {
  return "send" in item;
}

const originalDomainToFixed: IHash = {};

originalDomainToFixed["https://x.com/"] = "https://fxtwitter.com/";
originalDomainToFixed["https://twitter.com/"] = "https://fxtwitter.com/";
originalDomainToFixed["https://www.instagram.com/"] =
  "https://www.ddinstagram.com/";

const replaceDomainInMessage = async (message: Message): Promise<void> => {
  if (message.author.bot) return;

  let messageContent: string = message.content;
  let changed: boolean;

  for (const key of Object.keys(originalDomainToFixed)) {
    const newMessageContent = messageContent.replace(
      key,
      originalDomainToFixed[key],
    );
    if (messageContent !== newMessageContent) {
      changed = true;
      messageContent = newMessageContent;
    }
  }

  const channel = message.channel;
  if (changed && isPartialTextBasedChannelFields(channel)) {
    await Promise.all([message.suppressEmbeds(), channel.send(messageContent)]);
  }
};

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    await replaceDomainInMessage(message);
  },
  replaceDomainInMessage: replaceDomainInMessage,
};
