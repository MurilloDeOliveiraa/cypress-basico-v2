/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {

    beforeEach(() => {
        cy.visit('../src/index.html');
    })

    // comando abaixo é para repetir algo por tantas vezes q vc definir
    Cypress._.times(3, () => {
        it('Verifica o título da aplicação', () => {
            // Checking the title
            cy.title()
                .should('be.equal', 'Central de Atendimento ao Cliente TAT');
        })
    })

    it('Preenche campos obrigatórios', () => {
        let mensagem = "teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, "

        cy.get('#firstName')
            .type('Murillo')
            .should('have.value', 'Murillo');
        cy.get('#lastName').type('Teste de Oliveira', 10);
        cy.get('#email').type('testemail@test.com', { log: false }); //não mostrar no log do teste
        cy.get('#open-text-area').type(mensagem, { delay: 0 });
        cy.contains('.button', 'Enviar').click();

        cy.get('.success').should('be.visible');
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#email').type('testemail-test.com');
        cy.contains('.button', 'Enviar').click();
        cy.get('.error')
            .should('be.visible');
    })

    it('Verificando que o campo de telefone só aceita números', () => {
        cy.get('#phone')
            .type('murillo')
            .should('be.empty');
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#phone')
            .type('murillo')
            .should('be.empty');
        cy.contains('.button', 'Enviar').click();
        cy.get('.error')
            .should('be.visible');
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Murillo')
            .should('have.value', 'Murillo')
            .clear()
            .should('be.empty');
        cy.get('#lastName')
            .type('Teste de Oliveira', 10)
            .should('have.value', 'Teste de Oliveira')
            .clear()
            .should('be.empty');
        cy.get('#email')
            .type('testemail@test.com')
            .should('have.value', 'testemail@test.com')
            .clear()
            .should('be.empty');
        cy.get('#phone')
            .type('murillo')
            .clear()
            .should('be.empty');
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()  //congela o relógio do computador
        cy.contains('.button', 'Enviar').click();
        cy.get('.error')
            .should('be.visible');
        cy.tick(3000); //avança o relógio do computador em 3 segundos
        cy.get('.error')
            .should('not.be.visible');
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible');
    })

    it('seleciona produto no dropdown pelo texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube');
    })

    it('seleciona produto no dropdown pelo índice', () => {
        cy.get('#product')
            .select(3)
            .should('have.value', 'mentoria');
    })

    it('seleciona radio button', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
    })

    it('seleciona todos radio buttons', () => {
        cy.get('input[type="radio"]') // passo o selector onde contém todas as opções
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('Adiciona um arquivo', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
        //comando pra adicionar um arquivo
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(($input) => {
                console.log($input) //preciso usar o dev tools pra ver a variável
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Adiciona um arquivo utilizando drag and drop', () => {

        //comando pra adicionar um arquivo
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' }) //aqui eu falo q adiciona o arquivo através do drag and drop
            .should(($input) => {
                console.log($input) //preciso usar o dev tools pra ver a variável
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('Adiciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        // alias = dar um nome novo 
        cy.fixture('example.json').as('SampleFile')
        //comando pra adicionar um arquivo
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@SampleFile')
            .should(($input) => {
                console.log($input) //preciso usar o dev tools pra ver a variável
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')  //só verifico que ele tem um atributo target
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')  // uso esse comando para carregar a próxima aba no msm browser (não fico com 2 abas/browsers)
            .click()
        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
    })

    it('Faz uma requisção HTTP (REST)', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function (response) {
                const { status, statusText, body } = response
                expect(status).to.equal(200)
                expect(statusText).to.equal("OK")
                expect(body).to.include('CAC TAT')
            })
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#subtitle')
            .invoke('text', 'Meu nome é Murillo Lopes de Oliveira')
            .should('have.text', "Meu nome é Murillo Lopes de Oliveira")
            .should('be.visible')
    })

})