describe("Admin panel", () => {
  it("shows teams and users", () => {
    // Setup mocks
    cy.intercept("POST", "/v0/tasks/execute", (req) => {
      if (req.body.slug === "update_team") {
        req.alias = "update_team";
        req.reply({ runID: "1" });
      } else if (req.body.slug === "list_teams") {
        req.alias = "list_teams";
        req.reply({ runID: "1" });
      } else if (req.body.slug === "list_team_users") {
        req.reply({ runID: "2" });
      } else {
        throw new Error(`Unexpected task slug: ${req.body.slug}`);
      }
    });
    cy.intercept("POST", "/v0/runners/createScaleSignal", (req) => {
      expect(req.body.taskSlug).to.be.oneOf(["update_team", "list_teams"]);
      req.reply("{}");
    });
    cy.intercept("GET", "/v0/runs/get?id=1", {
      fixture: "getRunSuccess.json",
    });
    cy.intercept("GET", "/v0/runs/getOutputs?id=1", {
      fixture: "teams.json",
    });
    cy.intercept("GET", "/v0/permissions/get*", {
      fixture: "permissions.json",
    });
    cy.intercept("GET", "/v0/runs/get?id=2", {
      fixture: "getRunSuccess.json",
    });
    cy.intercept("GET", "/v0/runs/getOutputs?id=2", {
      fixture: "users.json",
    });

    // Start test
    cy.visit("/");

    cy.contains("Admin Panel");
    cy.contains("Manage our teams and users");

    // Teams table.
    cy.contains("Suspended");
    cy.contains("Team 1");
    cy.contains("Team 2");
    cy.contains("Jul 6, 2022 12:00 AM");
    cy.get('.tbody .tr:first [data-cy="cell-checkbox"]').should("be.checked");
    cy.get('.tbody .tr:last [data-cy="cell-checkbox"]').should(
      "not.be.checked",
    );

    cy.contains("id").should("not.exist");

    // Row action and edit
    cy.wait(1000);
    cy.log("Run the row action without editing");
    cy.contains("update_team").click();
    cy.contains("Are you sure you want to run update_team?");
    cy.contains("Run").click();
    cy.wait("@update_team")
      .its("request.body")
      .should("deep.equal", {
        slug: "update_team",
        resources: {},
        paramValues: {
          signup_date: "2022-07-06T00:00:00.000Z",
          id: 1,
          is_suspended: true,
          company_name: "Team 1",
          country: "USA",
        },
      });
    cy.wait("@list_teams"); // refresh table

    cy.log("Edit the first row and run the row action again.");
    cy.get(".tbody .tr:first [data-testid=edit-icon]:first").click({
      force: true,
    });
    cy.get(".tbody .tr:first textarea:first").type("!");
    cy.contains("Admin Panel").click(); // blur the textarea
    // The edited cell should be dirty.
    cy.get('[data-testid="static-cell-dirty"]').contains("Team 1!");

    cy.get('.tbody .tr:first [data-cy="cell-checkbox"]').click();

    cy.get(".tbody .tr:first [data-testid=edit-icon]:last").click({
      force: true,
    });
    cy.contains("India").click();

    cy.contains("update_team").click();
    cy.contains("Run").click();
    cy.wait("@update_team") // yields the same interception object
      .its("request.body")
      .should("deep.equal", {
        slug: "update_team",
        resources: {},
        paramValues: {
          signup_date: "2022-07-06T00:00:00.000Z",
          id: 1,
          is_suspended: false,
          company_name: "Team 1!",
          country: "India",
        },
      });
    cy.wait("@list_teams"); // refresh table

    // Filtering
    cy.log("Filtering");
    cy.get('[aria-label="filter"]:first').type("hi");
    cy.contains("No teams");
    cy.get('[aria-label="filter"]:first').clear().type("Team 2", {
      delay: 200,
    });
    cy.contains("Team 2");
    cy.get(".tbody .tr").should("have.length", 1);
    cy.get('[aria-label="filter"]').clear();
    cy.wait(200);

    // Sorting
    cy.contains("Company name").click();
    cy.wait(200);
    cy.get(".table:first .tbody .tr:last").contains("Team 2");
    cy.contains("Company name").click();
    cy.wait(200);
    cy.get(".table:first .tbody .tr:first").contains("Team 2");

    // Select a team, which should show the users table.
    cy.wait(500);
    cy.get(".tbody .tr:first").click();
    cy.contains("Users");
    cy.contains("User 1");
    cy.contains("User 2");

    // Users table checkbox row selection
    cy.wait(200);
    cy.get(".tbody:last .tr:first input").click();
    cy.get(".tbody:last .tr:first input").should("be.checked");
    cy.get(".tbody:last .tr:last input").should("not.be.checked");
    cy.contains("His name was User 1");
    cy.contains("His name was User 2").should("not.exist");

    cy.wait(200);
    cy.get(".tbody:last .tr:last input").click();
    cy.get(".tbody:last .tr:first input").should("be.checked");
    cy.get(".tbody:last .tr:last input").should("be.checked");
    cy.contains("His name was User 1");
    cy.contains("His name was User 2");

    // Clear users with button
    cy.contains("Clear users").click();
    cy.contains("Are you sure you want to clear users?");
    cy.contains("Clear the users").click();
    cy.get(".tbody:last .tr:first input").should("not.be.checked");
    cy.get(".tbody:last .tr:last input").should("not.be.checked");
    cy.contains("His name was User 1").should("not.exist");
    cy.contains("His name was User 2").should("not.exist");
  });
});
