class Table{
	constructor(o){
		this.id = `T${Utils.makeKey(5)}`;
		this.name = o ? o.name || null : null;
		this.grid = o ? o.grid || false : false;
		this.label = o ? o.label || null : null;
		this.labelStyle = o ? o.labelStyle || null : null;
		this.style = o ? o.style || null : null;
		this.headerStyle = o ? o.headerStyle || null : null;
		this.headers = o ? o.headers || [] : [];
		this.rows = o ? o.rows || [] : []
	}

	addRow(row, below){
		if(row.constructor.name == "Object"){
			row = new TableRow(row);
		}
		if(below || below == 0){
			this.rows.splice(below+1, 0, row);
		}
		else{
			this.rows.push(row);
		}
		return row;
	}

	addHeader(header){
		header = header.replace(/([A-Z])/g, ' $1').replace(/\w\S*/g, function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		})
		let add = true;
		for(let i = 0; i < this.headers.length; i++){
			if(header == this.headers[i]){
				add = false;
			}
		}
		if(add){
			this.headers.push(header);
		}
		return header;
	}

	getRowIndex(row){
		if(row){
			for(let i = 0; i < this.rows.length; i++){
				if(this.rows[i].id == row.id){
					return i;
				}
			}
		}
		return this.rows.length;
	}

	clear(){
		this.rows = [];
	}

	hasAction(){
		for(let i = 0; i < this.rows.length; i++){
			if(this.rows[i].action){
				return true;
			}
		}
	}

	deleteRow(id){
		for(let i = 0; i < this.rows.length; i++){
			if(this.rows[i].id == id){
				this.rows.splice(i, 1);
				return
			}
		}
	}
	
	deleteRowAtIndex(index){
		this.rows.splice(index, 1);
	}

	copy(){
		let newTable = new Table({
			label: this.label,
			style: this.style,
			headers: this.headers
		});
		for(let i = 0; i < this.rows.length; i++){
			newTable.rows.push(this.rows[i].copy());
		}

		return newTable;
	}

	setGridHover(){
		if(this.grid){
			setTimeout(()=>{
				for(let i = 0; i < this.rows.length; i++){
					this.rows[i].setGridHover();
				}
			},500);
		}
	}

	render(){
		let HTML = '';
		HTML += `<table id="${this.id}" class="table ${this.grid ? "grid" : ""}" style="${this.style ? this.style : ""}">`;

			if(this.label){
				HTML += `<thead class="table-header">`;
					HTML += `<th class="table-label" colspan="99" style="${this.labelStyle ? this.labelStyle : ""}">${this.label}</th>`;
				HTML += `</thead>`
			}

			if(this.headers[0] && this.headers[0].constructor.name == "Array"){
				let rowsHTML = [];
				for(let h = 0; h < this.headers.length; h++){
					rowsHTML[h] = [];
					let header = this.headers[h];					
					for(let r = 0; r < header.length; r++){
						let head = header[r];	
						for(let i = 0; i < head.length; i++){
							let item = head[i];
							if(item.constructor.name == 'Array'){
								for(let x = 0; x < item.length; x++){
									let xItem = item[x];
									rowsHTML[h].push(`<th class="table-header" rowspan="${xItem.r}}" colspan="${xItem.c}" style="${this.headerStyle ? this.headerStyle : ""}${xItem.s ? xItem.s : ""}">${xItem.l}</th>`);
								}
							}
							else{
								rowsHTML[h].push(`<th class="table-header" rowspan="${item.r}}" colspan="${item.c}" style="${this.headerStyle ? this.headerStyle : ""}${item.s ? item.s : ""}">${item.l}</th>`);
							}
						}
					}
				}

				HTML += `<thead class="table-headers">`;
					for(let i = 0; i < rowsHTML.length; i++){
						HTML += `<tr>${rowsHTML[i].join("")}</tr>`;
					}
				HTML += `</thead>`
			}

			else{
				HTML += `<thead class="table-headers">`;
					HTML += `<tr>`;
					for(let h = 0; h < this.headers.length; h++){
						HTML += `<th class="table-header" style="${this.headerStyle ? this.headerStyle : ""}">${this.headers[h]}</th>`
					}
					if(this.hasAction() && this.headers.length > 0){
						HTML += `<th class="table-header"></th>`
					}
					HTML += `</tr>`;
				HTML += `</thead>`
			}
			HTML += `<tbody class="table-body">`;
				for(let i = 0; i < this.rows.length; i++){
					HTML += this.rows[i].render(i);
				}
			HTML += `</tbody>`

		HTML += `</table>`

		this.setGridHover();
		return HTML;
	}
}

class TableRow{
	constructor(o){
		this.id = `R${Utils.makeKey(5)}`;
		this.columns = o ? o.columns || [] : [];
		this.action = o ? o.action || null : null;
		this.style = o ? o.style || null : null;
		this.event = o ? o.event || null : null;
	}

	setAction(action){
		if(action.constructor.name != "TableRowAction"){
			action = new TableRowAction(action);
		}
		this.action = action;
		return this;
	}

	copy(){
		let newRow = new TableRow({
			action: new TableRowAction({
				label: this.action.label,
				icon: this.action.icon,
				event: this.action.event
			}),
			style: this.style
		});
		for(let i = 0; i < this.columns.length; i++){
			newRow.columns.push(this.columns[i].copy());
		}
		return newRow;
	}

	addColumn(column){
		if(column.constructor.name != "TableColumn" && column.constructor.name != "TableRowAction"){
			column = new TableColumn(column);
		}
		this.columns.push(column);
		return this;
	}

	getColumn(header){
		for(var i = 0; i < this.columns.length; i++){
			if(this.columns[i].header == header){
				return this.columns[i];
			}
		}
		return null;
	}

	addEventListener(){
		setTimeout(()=>{
			if(document.getElementById(this.action.id)){
				if(this.event){
					document.getElementById(this.id).addEventListener("click", this.event);
				}
				if(this.action){
					this.action.addEventListener();
				}
			}
		}, 500);
	}
	
	setGridHover(){
		for(let i = 0; i < this.columns.length; i++){
			this.columns[i].setGridHover();
		}
	}

	render(r){
		let HTML = '';
		
		HTML += `<tr class="table-row" id="${this.id}" style="${this.style ? this.style : ""}">`;
			for(var i = 0; i < this.columns.length; i++){
				HTML += this.columns[i].render(r, i);
				if(this.columns[i].constructor.name == "TableRowAction"){
					this.columns[i].addEventListener();
				}
			}
			if(this.action){
				HTML += this.action.render();
				this.addEventListener();
			}
		HTML += `</tr>`
		return HTML;
	}
}

class TableColumn{
	constructor(o){
		this.id = `C${Utils.makeKey(5)}`;
		this.style  = o ? o.style  || null : null;
		this.wrapperStyle = o ? o.wrapperStyle || null : null;
		this.wrap  = o ? o.wrap  || null : null;
		this.value = o ? o.value || null : null;
		this.input = o ? o.input || null : null;
		this.icon = o ? o.icon || null : null;
		this.colspan = o ? o.colspan || null : null;
		this.row = 0;
		this.column = 0;
	}

	copy(){
		return new TableColumn({
			wrap: this.wrap,
			value: this.value,
			input: this.input
		});
	}

	getValue(){
		return this.input ? this.input.value : this.value;
	}

	clearGridHover(){
		document.querySelectorAll(`.table-cell`).forEach((e)=>{
			e.classList.remove('gridHover');
		});
	}
	clearGridHoverFocus(){
		document.querySelectorAll(`.table-cell`).forEach((e)=>{
			e.classList.remove('gridHoverFocus');
		});
	}

	gridHover(){
		if(document.getElementById(this.id)){
			let elem = document.getElementById(this.id);
			let table =	elem.parentElement.parentElement.parentElement;
			let row = Number(elem.dataset.row);
			let column = Number(elem.dataset.column);

			document.querySelectorAll(`.table-cell`).forEach((e)=>{
				e.classList.remove('gridHover');
			});
		
			for(let c = 0; c < column+1; c++){
				for(let r = 0; r < row+1; r++){
					document.querySelector(`#${table.id} .row-${row}.column-${c}`).classList.add('gridHover')
					document.querySelector(`#${table.id} .row-${r}.column-${column}`).classList.add('gridHover')
				}
			}

			let focus = document.querySelector(`#${table.id} input:focus`);
			if(focus){
				document.querySelectorAll(`.table-cell`).forEach((e)=>{
					e.classList.remove('gridHoverFocus');
				});		
				let focusCell = focus.parentElement.parentElement.parentElement;				
				let row = Number(focusCell.dataset.row);
				let column = Number(focusCell.dataset.column);		
				
				document.getElementById(focus.id).removeEventListener('blur', ()=>{
					document.querySelectorAll(`.table-cell`).forEach((e)=>{
						e.classList.remove('gridHoverFocus');
					});
				});
				document.getElementById(focus.id).addEventListener('blur', ()=>{
					document.querySelectorAll(`.table-cell`).forEach((e)=>{
						e.classList.remove('gridHoverFocus');
					});
				});

				for(let c = 1; c < column+1; c++){
					for(let r = 1; r < row+1; r++){
						document.querySelector(`#${table.id} .row-${row}.column-${c}`).classList.add('gridHoverFocus')
						document.querySelector(`#${table.id} .row-${r}.column-${column}`).classList.add('gridHoverFocus')
					}
				}
			}
		}
	}

	setGridHover(){
		if(document.getElementById(this.id)){
			document.getElementById(this.id).parentElement.parentElement.parentElement.removeEventListener('pointerleave', this.clearGridHover);
			document.getElementById(this.id).parentElement.parentElement.parentElement.addEventListener('pointerleave', this.clearGridHover);
			document.getElementById(this.id).removeEventListener('pointerenter', this.gridHover);
			document.getElementById(this.id).addEventListener('pointerenter', this.gridHover);
			document.getElementById(this.id).removeEventListener('click', this.gridHover);
			document.getElementById(this.id).addEventListener('click', this.gridHover);
		}
	}

	render(row, column){
		this.row = row;
		this.column = column;
		return `
		<td id="${this.id}" class="table-cell row-${row} column-${column}" data-row="${row}" colspan="${this.colspan ? this.colspan : 1}"  data-focus="false" data-column="${column}" style="white-space:${this.wrap ? "normal" : "nowrap"};${this.style ? this.style : ""}">
			<div class="table-cell-wrapper" style="${this.wrapperStyle ? this.wrapperStyle : ""}">${this.input ? this.input.render() : this.icon ? this.icon : this.value != null ? this.value : ""}</div>
		</td>`
	}
}

class TableRowAction{
	constructor(o){
		this.id = `A${Utils.makeKey(5)}`;
		this.label =  o ? o.label || null : null;
		this.value = o ? o.value || "" : "";
		this.icon =  o ? o.icon || null : null;
		this.menu = o ? o.menu || null : null;
		this.style =  o ? o.style || null : null;
		this.wrapperStyle = o ? o.wrapperStyle || null : null;
		this.onHover = o ? o.onHover || false : false;
		this.event = o ? o.event || null : null;
	}

	addEventListener(){
		setTimeout(()=>{
			if(document.getElementById(this.id)){
				if(this.event){
					document.getElementById(this.id).addEventListener("click", this.event);
				}
			}
		}, 500);
	}

	render(){
		return `
		<td class="table-cell action ${this.onHover ? "onHover" : ""} ${!this.icon && !this.value ? "no" : ""}" id="${this.id}" title="${this.label ? this.label : ""}" style="${this.style ? this.style : ""}">
			<div class="table-cell-wrapper" style="${this.wrapperStyle ? this.wrapperStyle : ""}">
				<div class="table-row-action">${this.menu ? this.menu.render() : this.icon ? this.icon : this.value}</div>
			</div>
		</td>`
	}
}