// Elementos DOM 
const navLinks = document . querySelectorAll ( 'nav a' );
 const pages = document . querySelectorAll ( '.page' );
 const licitantesTableBody = document . getElementById ( 'licitantes-table-body' );
 const searchLicenciante = document . getElementById ( 'search-licitante' );
 const btnNovoLicenciante = document . getElementById ( 'btn-novo-licitante' );
 const licitanteForm = document . getElementById ( 'licitante-form' );
 const licitantesList = document . getElementById ( 'licitantes-list' );
 const formLicenciante = document . getElementById ( 'form-licitante' );
 const btnCancelar = document . getElementById ( 'btn-cancelar' );
 const btnAddSocio = documento . getElementById ( 'btn-add-socio' );
 const sociosContainer = documento . getElementById ( 'sócios-container' );   // Variáveis ​​globais   let licitantes = [];
 deixe editarLicitanteId = null ;
 deixe socioCount = 1 ;   // Navegação entre páginas 
navLinks. forEach ( link => { 
  link. addEventListener ( 'click' , function ( e ) { 
    e. preventDefault ();   // Remove uma classe ativa de todos os links e páginas 
    navLinks. forEach ( l => l. classList . remove ( 'active' )); 
    pages. forEach ( p => p. classList . remove (





    
    'ativo' ));   // Adiciona a classe ativa ao link clicado   this . lista de classes . adicionar ( 'ativo' );   // Mostra a página correspondente   const pageId = this . getAttribute ( 'página de dados' );
     documento . getElementById (páginaId). lista de classes . adicionar ( 'ativo' ); 
  }); 
});   // Carregar licitantes   async function loadLicitantes (
    
  
  
    
  
  


  ) {
   try {
     const resposta = aguarda  busca ( '/api/licitantes' );
     if (!response. ok ) {
       throw  new  Error ( 'Erro ao carregar licitantes' ); 
    } 
    
    licitantes = aguarda resposta. json ();
     renderLicitantes (); 
  } catch (erro) {
     console . erro ( 'Erro:' , erro);
     alert ( 'Erro ao carregar licitantes. Verifique o console para mais detalhes.' ); 
  } 
}   // Renderizar licitantes na tabela   function renderLicitantes ( filteredList = null ) {
   const list = filteredList || licitantes; 
  licitantesTableBody. HTML interno = '' ;   if (list. length === 0 ) { 
    licitantesTableBody. innerHTML = ` 
      <tr> 
        <td colspan="6" style="text-align: center;">Nenhum licitante encontrado</td> 
      </tr> 
    ` ;
     retornar ; 
  } 
  lista. forEach ( licitante => {
     const row = document . createElement ( 'tr' ); 
    row. innerHTML = ` 
      <td> ${licitante.razao_social} </td> 
      <td> ${licitante.cnpj} </td> 
      <td> ${licitante.telefone || '-' } </td> 
      <td> ${licitante.email || '-' } </td> 
      <td> ${licitante.cidade || '-' } / ${licitante.estado || '-' } </td> 
      <td class="actions"> 
        <button class="btn btn-view" data-id=" ${licitante.id} ">Ver</button> 
        <button class="btn btn-edit" data-id=" ${licitante.id} ">Editar</button> 
        <button class="btn btn-delete" data-id="


 
  

    ${licitante.id} ">Excluir</button> 
      </td> 
    ` ;
    
    licitantesTableBody. appendChild (row);
  });   // Adicionar ouvintes de eventos aos botões   document . querySelectorAll ( '.btn-view' ). forEach ( btn => {
    btn. addEventListener ( 'click' , () => viewLicenciado (btn. getAttribute ( 'data-id' )));
  });   document . querySelectorAll ( '.btn-edit' ). forEach ( btn => {
    btn. addEventListener ( 'click' , () => editLicenciado (btn. getAttribute ( 'data-id' )));
  });   document . querySelectorAll ( '.btn-delete' ). forEach ( btn => {
    btn. addEventListener ( 'click' , () => deleteLicenciado (btn. getAttribute ( 'id de dados' )));
  });
}   // Filtrar licitantes 
searchLicitante. addEventListener ( 'input' , () => {
   const searchTerm = searchLicitante. value . toLowerCase ();   if (!searchTerm) {
     renderLicitantes ();
     return ;
  }   const filtered = licitantes. filter ( licitante =>  
    licitante. razao_social . toLowerCase (). inclui (searchTerm) || 
    licitante. cnpj . inclui (searchTerm)
  );   renderLicitantes (filtrado }
);   // Mostrar formulário de novo licitante 
btnNovoLicitante. addEventListener ( 'click' , () => {
  editandoLicitanteId = null ;
  formLicitante.reiniciar ();
  

 
  
 
  
 


  

  

  



  
  // Limpar sócios 
  sociosContainer. innerHTML = ` 
    <div class="socio-item"> 
      <div class="form-row"> 
        <div class="form-group"> 
          <label>Nome do Sócio 1:</label> 
          <input type="text" class="socio-nome"> 
        </div> 
        
        <div class="form-group"> 
          <label>CPF do Sócio 1:</label> 
          <input type="text" class="socio-cpf"> 
        </div> 
        
        <button type="button" class="btn btn-remove-socio" disabled>X</button> 
      </div> 
    </div> 
  ` ; 
  socioCount = 1 ; 
  
  licitantesList. style . display = 'none' ; 
  licitanteForm. style . display = 'block' ; 
});   // Cancelar formulário 
btnCancelar. addEventListener ( 'click' , () => { 
  licitanteForm. style . display = 'none'