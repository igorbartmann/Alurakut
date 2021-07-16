import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response){
    if(request.method === 'POST'){
        const TOKEN = "568c72d7eef031147a5244a0ba0cde";
        const client = new SiteClient(TOKEN);

        const registroCadastrado = await client.items.create({
            itemType: "968745", // ID do Model de "Communities" criado pelo Dato
            title: request.body.title,
            imageUrl: request.body.imageURL,
            creatorSlug: request.body.creatorSlug
        })

        response.json({
            registroCadastrado: registroCadastrado
        })
        return;
    }

    response.status(404).json({
        severidade: `ERRO`,
        message: `Ainda não temos nada no GET, apenas no POST!`
    })
}