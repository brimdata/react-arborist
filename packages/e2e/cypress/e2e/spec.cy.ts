import "@4tw/cypress-drag-drop";

describe("template spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/gmail");
    cy.get("[role=treeitem]").as("item");
  });

  it("Edits The Social Node", () => {
    cy.get("[role=treeitem").contains("Social").click();
    cy.focused().type("{enter}");
    cy.focused().type("My Favorite Social Sites{enter}");
    cy.get("[role=treeitem]").contains("My Favorite Social Sites");
  });

  it("Collapses and Expands the Categories", () => {
    cy.get("@item").should("have.length", "16");
    cy.get("@item").contains("Categories").click();
    cy.get("@item").should("have.length", "12");
    cy.get("@item").contains("Categories").click();
    cy.get("@item").should("have.length", "16");
  });

  it("Up and Down Arrows", () => {
    cy.get("@item").first().click();
    cy.focused().type("{downArrow}");
    cy.focused().should("contain.text", "Starred");
    cy.focused().type("{downArrow}");
    cy.focused().should("contain.text", "Snoozed");
    cy.focused().type("{upArrow}{upArrow}{upArrow}{upArrow}");
    cy.focused().should("contain.text", "Inbox");
  });

  it("Left and Right Arrows", () => {
    cy.get("@item").should("have.length", 16);
    cy.get("@item").contains("Categories").click();
    cy.focused().type("{leftArrow}");
    cy.get("@item").should("have.length", 12);
    cy.focused().type("{rightArrow}");
    cy.get("@item").should("have.length", 16);
    cy.focused().should("contain.text", "Categories");
    cy.focused().type("{rightArrow}");
    cy.focused().should("contain.text", "Social");
    cy.focused().type("{downArrow}");
    cy.focused().type("{downArrow}");
    cy.focused().should("contain.text", "Forums");
  });

  it("Creates Leaf Nodes", () => {
    // At the root level
    cy.get("@item").first().click();
    cy.focused().type("a");
    cy.focused().type("Turn A New Leaf{enter}");
    cy.get("@item").should("have.length", 17);

    // In a Folder
    cy.get("@item").contains("Social").click();
    cy.focused().type("a");
    cy.focused().type("Turn More Leaves{enter}");
    cy.get("@item").should("have.length", 18);

    // On a folder that is closed
    cy.get("@item").contains("Categories").click(); // closed it
    cy.focused().type("a");
    cy.focused().type("Root{enter}");
    cy.get("@item").contains("Root").click();
    cy.focused().should("have.attr", "aria-level", "0");

    // On a folder that is open
    cy.get("@item").contains("Categories").click(); // opened it
    cy.focused().type("a");
    cy.focused().type("Child{enter}");
    cy.get("@item").contains("Child").click();
    cy.focused().should("have.attr", "aria-level", "1");
  });

  it("Creates Internal Nodes", () => {
    // At the root level
    cy.get("@item").first().click();
    cy.focused().type("A");
    cy.focused().type("Turn A New Internal{enter}");
    cy.get("@item").should("have.length", 17);
    cy.focused().children().should("have.class", "isInternal");

    // In a Folder
    cy.get("@item").contains("Social").click();
    cy.focused().type("A");
    cy.focused().type("Turn More Inernals{enter}");
    cy.get("@item").should("have.length", 18);
    cy.focused().children().should("have.class", "isInternal");

    // On a folder that is closed
    cy.get("@item").contains("Categories").click(); // closed it
    cy.focused().type("A");
    cy.focused().type("Root{enter}");
    cy.get("@item").contains("Root").click();
    cy.focused().children().should("have.class", "isInternal");
    cy.focused().should("have.attr", "aria-level", "0");

    // On a folder that is open
    cy.get("@item").contains("Categories").click(); // opened it
    cy.focused().type("A");
    cy.focused().type("Child{enter}");
    cy.get("@item").contains("Child").click();
    cy.focused().should("have.attr", "aria-level", "1");
  });

  it("drags and drops in its list", () => {
    cy.get("@item")
      .contains("Inbox")
      .drag("[role=treeitem]:nth-child(5)", "bottom");

    cy.get("@item").contains("Inbox").click();
    cy.focused().invoke("index").should("eq", 4);
  });

  it("drags and drops into folder", () => {
    cy.get("@item").contains("Starred").drag("[role=treeitem]:nth-child(12)");

    cy.get("@item").contains("Starred").click();
    cy.focused().invoke("index").should("eq", 11);
  });

  it.only("prevents Inbox from Dragging into Categories", () => {
    cy.get("@item").contains("Inbox").drag("[role=treeitem]:nth-child(12)");
    cy.get("@item").contains("Inbox").click();
    cy.focused().invoke("index").should("eq", 0);
  });
});
