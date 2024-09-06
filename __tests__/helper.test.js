import { gold, blue, yellow, cornsilk } from "color-name";
import { common, getEmbedColor, ssr, starry, starry_ssr } from "../helper";
import { describe, expect, test } from "@jest/globals";

describe("getEmbedColor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("A common 0 plus pookie is blue", () => {
    expect(getEmbedColor("pookie", common)).toBe(blue);
  });

  test("A common 1 plus pookie is pastel pink", () => {
    expect(getEmbedColor("pookie+", common)).toBe("f08080");
  });

  test("A common 2 plus pookie is beige", () => {
    expect(getEmbedColor("pookie++", common)).toBe("ffe4b5");
  });

  test("A common 3 plus pookie is turquoise", () => {
    expect(getEmbedColor("pookie+++", common)).toBe("66ddaa");
  });

  test("A common 4 plus pookie is aqua", () => {
    expect(getEmbedColor("pookie++++", common)).toBe("00ffff");
  });

  test("A common 5 plus pookie is violet", () => {
    expect(getEmbedColor("pookie+++++", common)).toBe("663399");
  });

  test("A common 6 plus pookie is orchid", () => {
    expect(getEmbedColor("pookie++++++", common)).toBe("da70d6");
  });

  test("A common 7 or more plus pookie is white", () => {
    expect(getEmbedColor("pookie+++++++", common)).toBe("ffffff");
    expect(getEmbedColor("pookie++++++++", common)).toBe("ffffff");
    expect(getEmbedColor("pookie++++++++++++++", common)).toBe("ffffff");
  });

  test("A ssr 0 plus pookie is gold", () => {
    expect(getEmbedColor("pookie", ssr)).toBe(gold);
  });

  test("A ssr 1 plus pookie is hot pink", () => {
    expect(getEmbedColor("pookie+", ssr)).toBe("db07bf");
  });

  test("A ssr 2 plus pookie is turquoise", () => {
    expect(getEmbedColor("pookie++", ssr)).toBe("0dc7d1");
  });

  test("A ssr 3 plus pookie is orange", () => {
    expect(getEmbedColor("pookie+++", ssr)).toBe("d95e00");
  });

  test("A ssr 4 plus pookie is green", () => {
    expect(getEmbedColor("pookie++++", ssr)).toBe("00cf22");
  });

  test("A ssr 5 plus pookie is red", () => {
    expect(getEmbedColor("pookie+++++", ssr)).toBe("c4040e");
  });

  test("A ssr 6 plus pookie is navy", () => {
    expect(getEmbedColor("pookie++++++", ssr)).toBe("042ec4");
  });

  test("A ssr 7 or more plus pookie is bright pink", () => {
    expect(getEmbedColor("pookie+++++++", ssr)).toBe("ff03ee");
    expect(getEmbedColor("pookie++++++++", ssr)).toBe("ff03ee");
    expect(getEmbedColor("pookie++++++++++++++", ssr)).toBe("ff03ee");
  });

  test("A starry_ssr starry 0 plus pookie is gold", () => {
    expect(getEmbedColor("pookie", starry_ssr)).toBe(cornsilk);
  });

  test("A starry_ssr 1 plus pookie is pastel pink", () => {
    expect(getEmbedColor("pookie+", starry_ssr)).toBe("ffd1ef");
  });

  test("A starry_ssr 2 plus pookie is pastel purple", () => {
    expect(getEmbedColor("pookie++", starry_ssr)).toBe("e3d1ff");
  });

  test("A starry_ssr 3 plus pookie is pastel blue", () => {
    expect(getEmbedColor("pookie+++", starry_ssr)).toBe("cfe4ff");
  });

  test("A starry_ssr 4 plus pookie is pastel green", () => {
    expect(getEmbedColor("pookie++++", starry_ssr)).toBe("cafada");
  });

  test("A starry_ssr 5 plus pookie is pastel yellow", () => {
    expect(getEmbedColor("pookie+++++", starry_ssr)).toBe("fafaca");
  });

  test("A starry_ssr 6 plus pookie is pastel orange", () => {
    expect(getEmbedColor("pookie++++++", starry_ssr)).toBe("fadac0");
  });

  test("A starry_ssr 7 or more plus pookie is pastel salmon", () => {
    expect(getEmbedColor("pookie+++++++", starry_ssr)).toBe("fab1b1");
    expect(getEmbedColor("pookie++++++++", starry_ssr)).toBe("fab1b1");
    expect(getEmbedColor("pookie++++++++++++++", starry_ssr)).toBe("fab1b1");
  });

  test("A starry 0 plus pookie is yellow", () => {
    expect(getEmbedColor("pookie", starry)).toBe(yellow);
  });

  test("A starry 1 plus pookie is green", () => {
    expect(getEmbedColor("pookie+", starry)).toBe("65FA02");
  });

  test("A starry 2 plus pookie is green blue", () => {
    expect(getEmbedColor("pookie++", starry)).toBe("02FAB4");
  });

  test("A starry 3 plus pookie is dark blue", () => {
    expect(getEmbedColor("pookie+++", starry)).toBe("0244FA");
  });

  test("A starry 4 plus pookie is purple", () => {
    expect(getEmbedColor("pookie++++", starry)).toBe("AE0AFA");
  });

  test("A starry 5 plus pookie is hot pink", () => {
    expect(getEmbedColor("pookie+++++", starry)).toBe("FC12BA");
  });

  test("A starry 6 plus pookie is red", () => {
    expect(getEmbedColor("pookie++++++", starry)).toBe("FA002A");
  });

  test("A starry 7 or more plus pookie is a weird pink purple", () => {
    expect(getEmbedColor("pookie+++++++", starry)).toBe("c74298");
    expect(getEmbedColor("pookie++++++++", starry)).toBe("c74298");
    expect(getEmbedColor("pookie++++++++++++++", starry)).toBe("c74298");
  });
});
