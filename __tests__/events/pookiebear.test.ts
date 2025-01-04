const mockPookieFindAll = jest.fn();
const mockPookieUpdate = jest.fn();
const mockHurricanePookie = jest.fn();

const mockRandomInt = jest.fn();
const mockEmbedColor = jest.fn();

const randomSpy = jest.spyOn(global.Math, "random");

import { common, ssr, starry, starry_ssr } from "../../src/helper";
import { describe, expect, test } from "@jest/globals";
import {
  getPookieEmbedMessage,
  rollPookie,
  getHurricanePookie,
  buildEmbed,
} from "../../src/events/pookiebear";
import { Pookiebear } from "../../src/db/newModels/pookiebears";
import { Op } from "sequelize";

jest.mock("../../src/helper", () => ({
  ...jest.requireActual("../../src/helper"),
  getHurricanePookie: (...args) => mockHurricanePookie(...args),
  getRandomInt: (...args) => mockRandomInt(...args),
  getEmbedColor: (...args) => mockEmbedColor(...args),
}));

jest.mock("../../src/db/newModels/pookiebears", () => {
  return {
    default: {},
    findAllPookies: (...args) => mockPookieFindAll(...args),
    update: (...args) => mockPookieUpdate(...args),
  };
});

describe("getPookieEmbedMessage from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    mockRandomInt.mockReturnValue(0);
  });

  test("Roll a common pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(common)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: common },
    });
  });

  test("Roll a rare pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(ssr)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({ where: { rarity: ssr } });
  });

  test("Roll a starry pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(starry)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: starry },
    });
  });

  test("Roll a starry ssr pookie", async () => {
    mockPookieFindAll.mockReturnValue(
      Promise.resolve(["dummyPookie0", "dummyPookie1"]),
    );
    expect(await rollPookie(starry_ssr)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: { rarity: starry_ssr },
    });
  });
});

describe("getHurricanePookie from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Roll a common hurricane pookie", async () => {
    mockHurricanePookie.mockReturnValueOnce("dummyPookie0");
    mockPookieFindAll.mockReturnValue(Promise.resolve(["dummyPookie0"]));

    expect(await getHurricanePookie(0)).toBe("dummyPookie0");
    expect(mockPookieFindAll).toHaveBeenCalledWith({
      where: {
        pookie_name: {
          [Op.in]: [
            `starry night dummyPookie0`,
            `starry night dummyPookie0 ssr`,
            "dummyPookie0",
            `dummyPookie0 ssr`,
          ],
        },
        rarity: 0,
      },
    });
  });
});

describe("buildEmbed from pookiebear event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No double roll", () => {
    mockEmbedColor.mockReturnValueOnce("#FFFFFF");

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
      pookie as unknown as Pookiebear,
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
    mockEmbedColor.mockReturnValue("#FFFFFF");

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
      pookie as unknown as Pookiebear,
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
    mockEmbedColor.mockReturnValue("#FFFFFF");

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
      pookie as unknown as Pookiebear,
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
    mockEmbedColor.mockReturnValue("#FFFFFF");

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
      pookie as unknown as Pookiebear,
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
