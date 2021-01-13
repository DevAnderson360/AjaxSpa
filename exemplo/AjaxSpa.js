class AjaxSpa
{
	/*****/
	constructor({mainElement, routes})
	{
		this.mainElement = $(mainElement);

		this.routes = routes;

		this.divider = "#";//string que separa a url host da pagina solicitada

		this.start();
	}
	/*****/

	start()
	{
		this.urlPath();

		this.setLinksEvents();

		//captura to.back e to.forword do navegado (não funciona muito bem)
	    window.onpopstate = () => { 
		    //console.log(path, params)
		    this.urlPath();
	    }
	}

	//seta evento nos link com o parâmetro 
	setLinksEvents()
	{
		 
		$("a[nav-to]").click((e)=>{
			e.preventDefault();
			this.onNavigate(e.currentTarget.attributes['nav-to'].value);
		});
	}

	//adiciona .active nas classes 
	setActiveTag(path)
	{
		/***/
		$(".active").removeClass("active")

		$("a[nav-to]").each((i,e)=>{
			if($(e).attr("nav-to") === path)
				$(e).addClass("active");
		});
	}


	/**
	* trata a url e obtem a path 
	**/
	urlPath()
	{
		let {path, params} = this.getUrlParams();

		this.load(this.getRoutesPage(path), params);

		this.setActiveTag(path);
	}

	getUrlParams()
	{
		//pega toda url
		const url = document.URL;
		
		//separa a url em duas partes (antes e depois do divisor)
		const url_divider = url.split(this.divider);

		//armazena a path raiz
		let path = "\/";

		//armazena parametros
		let params = "";

		//busca por alguma path na url;
		if(url_divider.length > 1){
			
			let pathParams = url_divider[1];

			pathParams = pathParams.split("/");

			path += pathParams[1];

			params = pathParams.splice(2);

		}

		return {path, params};
	}

	urlDivider()
	{
		//pega toda a url
		let URL= document.URL;

		//divide a URL usando a var divider
		return URL.split(this.divider);
	}

	//retorna a page na routes de acordo com a path
	getRoutesPage(PATH)
	{
		return this.routes.find(route => route.path === PATH || route.path === "*").page;
	}

	//carrega documento com a page socilitada
	load(page, params)
	{
		$.ajax({
			 url: `pages/${page}`,
			 type: "POST",
			 data: {params: params},
			 dataType: 'html',
			 success: (content) => this.charge(content),
		});
	}

	//carrega conteudo na tag root
	charge(content)
	{
		this.mainElement.html(content);
	}

	onNavigate(PATH)
	{
		let url = this.urlDivider();
		let root_url = url[0];

		var directory = root_url+this.divider+PATH;
		
		if(PATH === "\/")
			directory = root_url;

		window.history.pushState(
		    {},
		    PATH,
		    directory
		  );

		this.urlPath();
		//this.load(this.getRoutesPage(PATH));

	}//AND METHOD ONNAVIGATE

}//AND CLASS Spa JS