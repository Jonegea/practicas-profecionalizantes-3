
class WCController
{
	constructor(viewInstance, modelInstance)
	{		
		this.innerView = viewInstance;
		this.innerModel = modelInstance;
	}

    evaluarExpresion()
    {
        const expresion = this.innerView.obtenerExpresion();
        if ((expresion)&&expresion[0]==='0') {
            //Si la expresion tiene valores y el primer valor es 0, se descarta
            return ;  
        } 
        let modelResponse = this.innerModel.evaluar(expresion);
        this.innerView.setResultado(JSON.stringify(modelResponse));
    }
}

export {WCController};