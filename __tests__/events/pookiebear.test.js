const mockPookieFindAll = jest.fn();
const mockPookieUpdate = jest.fn();

import { common, ssr, starry, starry_ssr } from "../../helper";
import { describe, expect, test } from "@jest/globals";
import {
  getPookieEmbedMessage,
  rollPookie,
  getHurricanePookie,
  buildEmbed,
} from "../../events/pookiebear";

const randomSpy = jest.spyOn(global.Math, "random");
const randomIntSpy = jest.spyOn(require("../../helper"), "getRandomInt");
const hurricanePookieSpy = jest.spyOn(
  require("../../helper"),
  "getHurricanePookie",
);
const embedColorSpy = jest.spyOn(require("../../helper"), "getEmbedColor");

jest.mock("../../db/dbObjects", () => {
  return {
    default: {},
    Pookiebears: {
      findAll: (...args) => mockPookieFindAll(...args),
      update: (...args) => mockPookieUpdate(...args),
    },
  };
});

describe("getPookieEmbedMessage from pookiebear event", () => {
  beforeEach(() => {});

  test("common", () => {
    expect(getPookieEmbedMessage(common)).toBe(`What a lovely pookiebear!\n`);
  });

  test("ssr", () => {
    expect(getPookieEmbedMessage(ssr)).toBe(`Holy shit! An SSR pookiebear!\n`);
  });

  test("starry", () => {
    expect(getPookieEmbedMessage(starry)).toBe(
      `A pookiebear found on a starry night\n`,
    );
  });

  test("starry_ssr", () => {
    expect(getPookieEmbedMessage(starry_ssr)).toBe(
      `OH MY STARS!! A starry night makes anything possible!\n`,
    );
  });
});

describe("rollPookie from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    randomSpy.mockReturnValue(0);
    randomIntSpy.mockReturnValue(0);
  });

  test("Roll a common pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(false, false)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: common },
    });
  });

  test("Roll a rare pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(false, true)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({ where: { rarity: ssr } });
  });

  test("Roll a starry pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(true, false)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: starry },
    });
  });

  test("Roll a starry ssr pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(true, true)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: starry_ssr },
    });
  });
});

describe("getHurricanePookie from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Roll a hurricane pookie", async () => {
    hurricanePookieSpy.mockReturnValue("dummyPookie0");
    mockPookieFindAll.mockReturnValue(Promise.resolve(["dummyPookie0"]));

    expect(await getHurricanePookie()).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { pookie_name: "dummyPookie0" },
    });
  });
});

describe("buildEmbed from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No double roll", () => {
    embedColorSpy.mockReturnValue("#FFFFFF");

    const pookie = {
      pookie_name: "jill stingray ssr",
      rarity: ssr,
      summon_count: 1,
      file_path: "./images/jillStingrayMyWife.jpeg",
    };
    const summonerName = "acridstingray3";
    const summonAttempts = 1;
    const pookiesToSummon = 1;
    const returned = buildEmbed(
      pookie,
      summonerName,
      summonAttempts,
      pookiesToSummon,
    );

    expect(returned.embeds.length).toBe(1);

    expect(returned.embeds[0].data.author.name).toBe(
      "summoned by: acridstingray3\nattempt count: 1",
    );

    expect(returned.embeds[0].data.color).toBe(16777215);

    expect(returned.embeds[0].data.title).toBe("jill stingray ssr");

    expect(returned.embeds[0].data.footer.icon_url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
    expect(returned.embeds[0].data.footer.text).toBe(
      "Holy shit! An SSR pookiebear!\nTotal summon count: 1",
    );

    expect(returned.embeds[0].data.image.url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
  });

  test("Double roll", () => {
    embedColorSpy.mockReturnValue("#FFFFFF");

    const pookie = {
      pookie_name: "jill stingray ssr",
      rarity: ssr,
      summon_count: 2,
      file_path: "./images/jillStingrayMyWife.jpeg",
    };
    const summonerName = "acridstingray3";
    const summonAttempts = 1;
    const pookiesToSummon = 2;
    const returned = buildEmbed(
      pookie,
      summonerName,
      summonAttempts,
      pookiesToSummon,
    );

    expect(returned.embeds.length).toBe(1);

    expect(returned.embeds[0].data.author.name).toBe(
      "summoned by: acridstingray3\nattempt count: 1",
    );

    expect(returned.embeds[0].data.color).toBe(16777215);

    expect(returned.embeds[0].data.title).toBe(
      "jill stingray ssr *2 ! \n **L U C K Y !**",
    );

    expect(returned.embeds[0].data.footer.icon_url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
    expect(returned.embeds[0].data.footer.text).toBe(
      "Holy shit! An SSR pookiebear!\nTotal summon count: 2",
    );

    expect(returned.embeds[0].data.image.url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
  });
});

describe("buildEmbed from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No double roll", () => {
    embedColorSpy.mockReturnValue("#FFFFFF");

    const pookie = {
      pookie_name: "jill stingray ssr",
      rarity: ssr,
      summon_count: 1,
      file_path: "./images/jillStingrayMyWife.jpeg",
    };
    const summonerName = "acridstingray3";
    const summonAttempts = 1;
    const pookiesToSummon = 1;
    const returned = buildEmbed(
      pookie,
      summonerName,
      summonAttempts,
      pookiesToSummon,
    );

    expect(returned.embeds.length).toBe(1);

    expect(returned.embeds[0].data.author.name).toBe(
      "summoned by: acridstingray3\nattempt count: 1",
    );

    expect(returned.embeds[0].data.color).toBe(16777215);

    expect(returned.embeds[0].data.title).toBe("jill stingray ssr");

    expect(returned.embeds[0].data.footer.icon_url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
    expect(returned.embeds[0].data.footer.text).toBe(
      "Holy shit! An SSR pookiebear!\nTotal summon count: 1",
    );

    expect(returned.embeds[0].data.image.url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
  });

  test("Double roll", () => {
    embedColorSpy.mockReturnValue("#FFFFFF");

    const pookie = {
      pookie_name: "jill stingray ssr",
      rarity: ssr,
      summon_count: 2,
      file_path: "./images/jillStingrayMyWife.jpeg",
    };
    const summonerName = "acridstingray3";
    const summonAttempts = 1;
    const pookiesToSummon = 2;
    const returned = buildEmbed(
      pookie,
      summonerName,
      summonAttempts,
      pookiesToSummon,
    );

    expect(returned.embeds.length).toBe(1);

    expect(returned.embeds[0].data.author.name).toBe(
      "summoned by: acridstingray3\nattempt count: 1",
    );

    expect(returned.embeds[0].data.color).toBe(16777215);

    expect(returned.embeds[0].data.title).toBe(
      "jill stingray ssr *2 ! \n **L U C K Y !**",
    );

    expect(returned.embeds[0].data.footer.icon_url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
    expect(returned.embeds[0].data.footer.text).toBe(
      "Holy shit! An SSR pookiebear!\nTotal summon count: 2",
    );

    expect(returned.embeds[0].data.image.url).toBe(
      "attachment://jillStingrayMyWife.jpeg",
    );
  });
});
