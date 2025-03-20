export class Tarefa{
    constructor(titulo,vencimento,importancia,check){
        this.id = crypto.randomUUID();  
        this.titulo = titulo;
        this.vencimento = vencimento;
        this.importancia = importancia;        
        this.check = check;
    }
}