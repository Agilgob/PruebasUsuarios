
export function actionButton(buttonText){
    return cy.get('section[class^="ExpedientActions_actions"]').find('button').filter(`:contains("${buttonText}")`).first()
}

    