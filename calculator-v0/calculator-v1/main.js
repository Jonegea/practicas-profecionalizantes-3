import { WCModel } from './WCModel.js';
import { WCView } from './WCView.js';

function main()
{
	let model = new WCModel();
	let view = new WCView(model);

	document.body.appendChild(view);

}

window.onload = main;

export { main };
