import { test, expect } from "@playwright/test";
import path from "path";

const bundlePath = path.resolve("./dist/bundle.iife.min.js");

test.beforeEach(async ({ page }) => {
  await page.goto("about:blank");
  await page.addScriptTag({ path: bundlePath });
  await page.evaluate(() => {
    document.body.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const div = document.createElement("div");
      div.textContent = `item${i}`;
      document.body.appendChild(div);
    }
  });
});

test.describe("$", () => {
  test("textContent one element", async ({ page }) => {
    const text = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div:first-child").textContent = "hello";
      return document.getElementsByTagName("div")[0].textContent;
    });
    expect(text).toBe("hello");
  });

  test("textContent one element with type", async ({ page }) => {
    const text = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const div = $("div:first-child");
      div.textContent = "hello";
      return document.getElementsByTagName("div")[0].textContent;
    });
    expect(text).toBe("hello");
  });

  test("textContent all elements", async ({ page }) => {
    const text = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div").textContent = "hello";
      return document.body.textContent;
    });
    expect(text).toBe("hellohellohellohellohellohello");
  });

  test("length", async ({ page }) => {
    const length = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      return $("div").length;
    });
    expect(length).toBe(6);
  });

  test("forEach", async ({ page }) => {
    const texts = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const divs = $("div");
      divs.forEach((div: HTMLElement, i: number) => {
        div.textContent = `div ${i}`;
      });
      return [divs[0].textContent, divs[5].textContent];
    });
    expect(texts[0]).toBe("div 0");
    expect(texts[1]).toBe("div 5");
  });

  test("for of", async ({ page }) => {
    const texts = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const divs = $("div");
      let i = 0;
      for (const div of divs) {
        (div as HTMLElement).textContent = `div ${i++}`;
      }
      return [divs[0].textContent, divs[5].textContent];
    });
    expect(texts[0]).toBe("div 0");
    expect(texts[1]).toBe("div 5");
  });

  test("setAttribute all elements", async ({ page }) => {
    const attrs = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div").setAttribute("aria-label", "List item");
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].getAttribute("aria-label"),
        divs[1].getAttribute("aria-label"),
        divs[5].getAttribute("aria-label"),
      ];
    });
    expect(attrs[0]).toBe("List item");
    expect(attrs[1]).toBe("List item");
    expect(attrs[2]).toBe("List item");
  });

  test("filter", async ({ page }) => {
    const text = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div").filter(
        (el: HTMLElement) => el.textContent == "item1"
      ).textContent = "hello";
      return document.body.textContent;
    });
    expect(text).toBe("item0helloitem2item3item4item5");
  });

  test("class add method", async ({ page }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div").classList.add("some-class");
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].classList.contains("some-class"),
        divs[5].classList.contains("some-class"),
      ];
    });
    expect(results[0]).toBeTruthy();
    expect(results[1]).toBeTruthy();
  });

  test("rel add and contains method", async ({ page }) => {
    const result = await page.evaluate(() => {
      const a = document.createElement("a");
      a.relList.add("some-class");
      return a.relList.contains("some-class");
    });
    expect(result).toBeTruthy();
  });

  test("class value property", async ({ page }) => {
    const value = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div").classList.add("some-class");
      const divs = document.getElementsByTagName("div");
      return divs[0].classList.value;
    });
    expect(value).toBe("some-class");
  });

  test("class add method and textContent property", async ({ page }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div:first-child").classList.add("some-class").textContent = "hello";
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].classList.contains("some-class"),
        divs[5].classList.contains("some-class"),
        divs[0].textContent,
        divs[5].textContent,
      ];
    });
    expect(results[0]).toBeTruthy();
    expect(results[1]).toBeFalsy();
    expect(results[2]).toBe("hello");
    expect(results[3]).toBe("item5");
  });

  test("filter and class add method and textContent property", async ({
    page,
  }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div")
        .filter((el: HTMLElement) => el.textContent == "item0")
        .classList.add("some-class").textContent = "hello";
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].classList.contains("some-class"),
        divs[5].classList.contains("some-class"),
        divs[0].textContent,
        divs[5].textContent,
      ];
    });
    expect(results[0]).toBeTruthy();
    expect(results[1]).toBeFalsy();
    expect(results[2]).toBe("hello");
    expect(results[3]).toBe("item5");
  });

  test("filter and style setProperty method and textContent property", async ({
    page,
  }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div")
        .filter((el: HTMLElement) => el.textContent == "item0")
        .style.setProperty("--leftmargin", "10px").textContent = "hello";
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].style.getPropertyValue("--leftmargin"),
        divs[5].style.getPropertyValue("--leftmargin"),
        divs[0].textContent,
        divs[5].textContent,
      ];
    });
    expect(results[0]).toBe("10px");
    expect(results[1]).toBe("");
    expect(results[2]).toBe("hello");
    expect(results[3]).toBe("item5");
  });

  test("combined", async ({ page }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div")
        .forEach(
          (el: HTMLElement) =>
            (el.title = `A div with content ${el.textContent}`)
        )
        .setAttribute("aria-label", "List item")
        .filter((el: HTMLElement) => el.textContent == "item1").textContent =
        "hello";
      const divs = document.getElementsByTagName("div");
      return [
        divs[0].getAttribute("aria-label"),
        divs[5].getAttribute("aria-label"),
        divs[0].getAttribute("title"),
        divs[5].getAttribute("title"),
        document.body.textContent,
      ];
    });
    expect(results[0]).toBe("List item");
    expect(results[1]).toBe("List item");
    expect(results[2]).toBe("A div with content item0");
    expect(results[3]).toBe("A div with content item5");
    expect(results[4]).toBe("item0helloitem2item3item4item5");
  });

  test("textContent empty list", async ({ page }) => {
    await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div.non-existent").textContent = "hello";
    });
  });

  test("setAttribute empty list", async ({ page }) => {
    await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div.non-existent").setAttribute("aria-label", "List item");
    });
  });

  test("call element specific function", async ({ page }) => {
    await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const input = document.createElement("input");
      document.querySelector("div:first-child")!.appendChild(input);
      $("input").select();
    });
  });

  test("addEventListener", async ({ page }) => {
    const fired = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const { $ } = (window as any).carbonium;
          $("div:first-child").addEventListener("click", () => resolve(true));
          $("div:first-child").click();
        })
    );
    expect(fired).toBe(true);
  });

  test("canvas", async ({ page }) => {
    await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const canvas = document.createElement("canvas");
      $("div:nth-child(1)").appendChild(canvas);
      const ctx = $("canvas").getContext("2d", { alpha: false });
      ctx.fillRect(0, 0, 100, 100);
    });
  });

  test("style set/get", async ({ page }) => {
    const color = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      $("div:nth-child(1)").style.color = "red";
      return $("div:nth-child(1)").style.color;
    });
    expect(color).toBe("red");
  });

  test("Parse HTML", async ({ page }) => {
    const results = await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      const div$ = $("<div class='a1'>b1</div>");
      const hasClass = div$.classList.contains("a1");
      $("div:first-child").appendChild(div$[0]);
      return [hasClass, $(".a1").length, $(".a1").textContent];
    });
    expect(results[0]).toBeTruthy();
    expect(results[1]).toBe(1);
    expect(results[2]).toBe("b1");
  });

  test("Set", async ({ page }) => {
    const result = await page.evaluate(() => {
      const set = new Set(["1a", "2a", "3a"]);
      let result = "";
      set.forEach((item) => {
        result += `[${item}]`;
      });
      return result;
    });
    expect(result).toBe("[1a][2a][3a]");
  });

  test("Custom Element", async ({ page }) => {
    await page.evaluate(() => {
      const { $ } = (window as any).carbonium;
      class GolInfo extends HTMLElement {
        connectedCallback() {
          $("nnn").addEventListener("click", () => {
            console.log("click");
          });
        }
      }
      customElements.define("gol-info", GolInfo);
      const i = document.createElement("gol-info");
      document.body.appendChild(i);
    });
  });
});
