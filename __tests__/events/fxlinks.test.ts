const mockSuppressEmbed = jest.fn().mockReturnValue(Promise.resolve());
const mockChannelSend = jest.fn().mockReturnValue(Promise.resolve());

import { replaceDomainInMessage } from "../../src/events/fxlinks";

let message;
describe("fxLinks event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    message = {
      author: {
        bot: false,
      },
      suppressEmbeds: mockSuppressEmbed,
      channel: {
        send: mockChannelSend,
      },
    };
  });

  test("twitter", async () => {
    message.content =
      "https://twitter.com/Dekunle27/status/1874869477139181911";

    await replaceDomainInMessage(message);

    expect(mockSuppressEmbed).toHaveBeenCalled();
    expect(mockChannelSend).toHaveBeenCalledWith(
      "https://fxtwitter.com/Dekunle27/status/1874869477139181911",
    );
    expect(mockChannelSend).toHaveBeenCalledTimes(1);
  });

  test("x the everything app", async () => {
    message.content = "https://x.com/AuroraGlimmer1/status/1875273470575309215";

    await replaceDomainInMessage(message);

    expect(mockSuppressEmbed).toHaveBeenCalled();
    expect(mockChannelSend).toHaveBeenCalledWith(
      "https://fxtwitter.com/AuroraGlimmer1/status/1875273470575309215",
    );
    expect(mockChannelSend).toHaveBeenCalledTimes(1);
  });

  test("insta", async () => {
    message.content = "https://www.instagram.com/p/DCcoKzWxJFU/";

    await replaceDomainInMessage(message);

    expect(mockSuppressEmbed).toHaveBeenCalled();
    expect(mockChannelSend).toHaveBeenCalledWith(
      "https://www.instagramez.com/p/DCcoKzWxJFU/",
    );
    expect(mockChannelSend).toHaveBeenCalledTimes(1);
  });

  test("no recognized domain", async () => {
    message.content = "https://www.heyManHowIsItGoing.com";

    await replaceDomainInMessage(message);

    expect(mockSuppressEmbed).not.toHaveBeenCalled();
    expect(mockChannelSend).not.toHaveBeenCalled();
  });
});
