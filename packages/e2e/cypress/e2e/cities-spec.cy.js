describe("Testing the Cities Demo", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/cities");
  });

  it("Does not steel the selection when the selection prop changes", () => {
    cy.get("button").contains("Select San Francisco").click();
    cy.focused().invoke("is", "button").should("equal", true);
    cy.focused().should("have.text", "Select San Francisco");
  });
});
