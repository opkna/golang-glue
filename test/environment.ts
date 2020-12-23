import "../src/index";

describe("Environment", () => {
    it("window have __jsbridge", () => {
        expect(typeof window).toBe("object");
        expect(typeof window.__jsbridge).toBe("object");
    });
});
