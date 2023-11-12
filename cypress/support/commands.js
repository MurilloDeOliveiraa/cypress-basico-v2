Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    let mensagem = "teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, "

    cy.get('#firstName').type('Murillo');
    cy.get('#lastName').type('Teste de Oliveira', 10);
    cy.get('#email').type('testemail@test.com');
    cy.get('#open-text-area').type(mensagem, { delay: 0 });
    cy.get('.button').click();
})