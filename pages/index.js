import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken'; // para decodificar o token salvo nos cookies (passados da tela de login para a home)
import Box from '../src/components/Box/'
import MainGrid from '../src/components/MainGrid/'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations/'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

function ProfileSidebar(propriedades) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.gitHubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.gitHubUser}`}>
          @{propriedades.gitHubUser}
        </a>
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{propriedades.title} ({propriedades.items.length})</h2>
      <ul>
        {propriedades.items.map((item) => {
          return (
            <li key={item.id}>
              <a href={`https://github.com/${item.login}`}>
                <img src={`https://github.com/${item.login}.png`} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) { // props são as propriedades recebidas pelo método getServerSideProps
  // Usuário
  const githubUser = props.githubUser;

  // Seguidores e Comunidades, são states e os seus dados vem de uma request
  const [seguidores, setSeguidores] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);
  React.useEffect(function() {
    // GET
    // -> Seguidores
    fetch('https://api.github.com/users/igorbartmann/followers')
    .then((respostaDoServidor) => {
      return respostaDoServidor.json();
    })
    .then((respostaCompletaJson) => {
      setSeguidores(respostaCompletaJson);
    });

    // GraphQL - Graph Query Language (DATO CMS)
    // -> Comunidades
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'f86b3911a3d0a39c013aed23ff54f8',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `
      query {
        allCommunities{
          id,
          title,
          imageUrl,
          creatorSlug
        }
      }`
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((fullResponse) => {
      const comunidadesRecebidas = fullResponse.data.allCommunities;
      setComunidades(comunidadesRecebidas);
    })
  }, [])

  // DICA, COLOCAR AS PESSOAS TAMBEM NO "DATA CMS"
  // Pessoas da comunidade
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar gitHubUser={githubUser}/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>     

            <form onSubmit={function handleCreateCommunity(event) {
              event.preventDefault();

              var dadosForm = new FormData(event.target);
              var nomeComunidade = dadosForm.get('title');
              var urlImagemComunidade = dadosForm.get('image');

              const novaComunidade = {
                title: nomeComunidade,
                imageUrl: urlImagemComunidade,
                creatorSlug: {githubUser}
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaComunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                var comunidadesAtualizadas = [...comunidades, dados.registroCadastrado];
                setComunidades(comunidadesAtualizadas);
              })
              .catch((error) => {
                alert("Ocorreu um erro ao cadastrar a comunidade!")
              })
            }}>
              <div>
                <input
                  type="text"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa."
                  placeholder="Coloque uma URL para usarmos de capa."
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/users/${item}`}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/communities/${item.id}`}>
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}


// Método padrão (Deve conter estes nomes específicos - NÃO ALTERAR)
// para redirecionar o usuário para a tela de login, caso não possuir um TOKEN válido e ativo.
export async function getServerSideProps(contexto) {
  const cookies = nookies.get(contexto);
  const token = cookies.USER_TOKEN;
  const tokenDecodificado = jwt.decode(token);

  // Local: "http://localhost:3000/api/auth" <-> Server: "https://alurakut-igorbartmann.vercel.app/"
  const { isAuthenticated } = await fetch('https://alurakut-igorbartmann.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((response) => response.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const githubUser = tokenDecodificado.githubUser;
  return {
    props: {
      githubUser: githubUser
    }
  }
}